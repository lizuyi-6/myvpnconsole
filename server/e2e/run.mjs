/**
 * NOVA end-to-end verification (Playwright, headless Chromium).
 * Runs against the production single-process deployment (SPA + API).
 *
 * Use `npm run test:e2e` from the repo root — it builds nothing itself;
 * run `npm run build` (frontend) and `npm run build` (server) first, or let
 * e2e/run.sh point WEB_ROOT at an existing dist/.
 */
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE ?? "http://127.0.0.1:8791";
const results = [];
let failures = 0;

function check(name, ok, detail = "") {
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
}

const browser = await chromium.launch({
  // Override when the bundled browser build is missing (e.g. a cached
  // chromium from another playwright version): E2E_EXECUTABLE=/path/to/chrome
  ...(process.env.E2E_EXECUTABLE ? { executablePath: process.env.E2E_EXECUTABLE } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(9000);

// Chinese UI to verify zh copy end-to-end.
await page.goto(`${BASE}/login`);
await page.evaluate(() => localStorage.setItem("nova.lang", "zh"));

/* ---- 1. Register a fresh account ---- */
await page.goto(`${BASE}/register`);
await page.fill("#name", "王测试");
await page.fill("#email", "e2e.wang@test.dev");
await page.fill("#password", "e2e-password-8");
await page.fill("#confirmPassword", "e2e-password-8");
await page.getByRole("button", { name: "创建账户" }).click();
await page.waitForURL("**/console");
check("register redirects to console", page.url().endsWith("/console"));

/* ---- 2. Fresh account → honest no-subscription empty state ---- */
await page.getByText("暂无有效订阅").waitFor();
check("overview shows no-access empty state (zh)", true);
check(
  "empty state CTA links to plans",
  (await page.getByRole("link", { name: "查看套餐" }).getAttribute("href")) === "/plans",
);

/* ---- 3. Plans → checkout 30d ---- */
await page.goto(`${BASE}/plans`);
await page.locator('input[name="plan"][value="30d"]').check();
await page.getByRole("button", { name: /继续/ }).click();
await page.waitForURL("**/checkout?plan=30d");
check("plans page navigates to /checkout?plan=30d", true);

/* ---- 4. Fill checkout, pay (simulated) ---- */
await page.fill("#name", "王测试");
await page.fill("#email", "e2e.wang@test.dev");
await page.fill("#cardNumber", "4242 4242 4242 4242");
await page.fill("#cardExpiry", "12/28");
await page.fill("#cardCvc", "123");
await page.getByRole("button", { name: /激活访问/ }).click();
await page.waitForURL("**/access/activated");
check("checkout completes → activated page", true);

/* ---- 5. Activated page shows expiry summary (server-computed) ---- */
await page.getByText(/30/).first().waitFor();
const activatedText = await page.evaluate(() => document.body.innerText);
check(
  "activated shows 30-day plan + future expiry",
  activatedText.includes("30") && activatedText.includes("2026"),
);

/* ---- 6. Console overview shows real server data ---- */
await page.goto(`${BASE}/console`);
await page.getByText("网络接入").first().waitFor();
const overviewText = await page.evaluate(() => document.body.innerText);
check("overview shows active status", overviewText.includes("生效中"));
check("overview shows 30-day term", /30\s*天/.test(overviewText));
check("overview shows devices 0/5", /0\s*\/\s*5/.test(overviewText));

/* ---- 7. Devices empty state ---- */
await page.goto(`${BASE}/console/devices`);
await page.getByText("暂无已连接设备").waitFor();
check("devices page shows empty state", true);

/* ---- 8. Support: create a ticket ---- */
await page.goto(`${BASE}/console/support`);
await page.getByRole("button", { name: /创建工单/ }).click();
await page.fill("#subject", "E2E 验证工单");
await page.fill("#message", "这是端到端验证创建的工单，内容超过二十个字符。");
await page.getByRole("button", { name: /提交工单/ }).click();
await page.getByText("E2E 验证工单").waitFor();
check("ticket created and listed", true);

/* ---- 9. Billing shows the payment ---- */
await page.goto(`${BASE}/console/billing`);
await page.getByText(/NOVA-\d{6}-\d{4}/).first().waitFor();
const billingText = await page.evaluate(() => document.body.innerText);
check("billing lists the new payment with number", /NOVA-\d{6}-\d{4}/.test(billingText));
check("billing shows $6.90", billingText.includes("$6.90"));

/* ---- 10. Regenerate subscription link (confirmed destructive action) ---- */
await page.goto(`${BASE}/console/subscription`);
await page.getByRole("button", { name: /重新生成/ }).click();
const confirmBtn = page.getByRole("button", { name: /^重新生成$/ });
await confirmBtn.last().click();
await page.waitForTimeout(1200);
const subText = await page.evaluate(() => document.body.innerText);
check("subscription page still healthy after regenerate", subText.includes("网络接入"));

/* ---- 11. Sign out → wrong password → re-login ---- */
await page.goto(`${BASE}/console/settings`);
await page.locator("#main-content").getByRole("button", { name: /退出登录/ }).click();
await page.waitForURL(`${BASE}/`);
check("sign out returns to home", true);

await page.goto(`${BASE}/login`);
await page.fill("#email", "e2e.wang@test.dev");
await page.fill("#password", "wrong-password-1");
await page.getByRole("button", { name: "登录" }).click();
await page.getByText("邮箱或密码不正确").waitFor();
check("wrong password shows localized error", true);

await page.fill("#password", "e2e-password-8");
await page.getByRole("button", { name: "登录" }).click();
await page.waitForURL("**/console");
check("re-login restores session", true);
await page.goto(`${BASE}/console`);
await page.getByText(/30\s*天/).first().waitFor();
check("subscription persisted across sessions (SQLite)", true);

/* ---- 12. Demo account has the seeded dataset ---- */
await page.goto(`${BASE}/console/settings`);
await page.locator("#main-content").getByRole("button", { name: /退出登录/ }).click();
await page.waitForURL(`${BASE}/`);
await page.goto(`${BASE}/login`);
await page.fill("#email", "alex.chen@example.com");
await page.fill("#password", "nova-demo-2026");
await page.getByRole("button", { name: "登录" }).click();
await page.waitForURL("**/console");
await page.getByText("Alex Chen").first().waitFor();
check("demo account logs in", true);
await page.goto(`${BASE}/console/devices`);
await page.getByText("Windows Laptop").waitFor();
check("demo devices visible", true);
await page.goto(`${BASE}/console/billing`);
await page.getByText("NOVA-260902-1031").waitFor();
check("demo payments visible", true);
await page.goto(`${BASE}/console/support`);
await page.getByText("Slow speeds on Japan region in the evening").waitFor();
check("demo tickets visible", true);

/* ---- 13. Duplicate registration → localized 409 ---- */
await page.goto(`${BASE}/console/settings`);
await page.locator("#main-content").getByRole("button", { name: /退出登录/ }).click();
await page.waitForURL(`${BASE}/`);
await page.goto(`${BASE}/register`);
await page.fill("#name", "重复者");
await page.fill("#email", "e2e.wang@test.dev");
await page.fill("#password", "another-pass-8");
await page.fill("#confirmPassword", "another-pass-8");
await page.getByRole("button", { name: "创建账户" }).click();
await page.getByText("该邮箱已注册").waitFor();
check("duplicate email shows localized 409 error", true);

/* ---- 14. Signed-out guard ---- */
await page.goto(`${BASE}/console`);
await page.waitForURL(/\/login\?next=/);
check("signed-out /console redirects to login with next param", true);

/* ---- 15. English smoke ---- */
await page.evaluate(() => localStorage.setItem("nova.lang", "en"));
await page.goto(`${BASE}/plans`);
await page.getByText("Network Access").first().waitFor();
const plansText = await page.evaluate(() => document.body.innerText);
check("EN plans page lists 30 Days", plansText.includes("30 Days"));

/* ---- 16. Public network page driven by API ---- */
await page.goto(`${BASE}/network`);
await page.getByText("South Korea").waitFor();
const netText = await page.evaluate(() => document.body.innerText);
check("network page lists regions from API", netText.includes("Japan") && netText.includes("Germany"));

await browser.close();

console.log(results.join("\n"));
console.log(`\n${results.length - failures}/${results.length} checks passed`);
process.exit(failures ? 1 : 0);
