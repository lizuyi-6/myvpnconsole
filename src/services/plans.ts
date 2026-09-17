import { mockPlans } from "@/mocks/plans";
import { delay, ServiceError } from "@/services/mock-transport";
import type { Plan } from "@/types";

/**
 * Plan catalog.
 * Backend contract: GET /plans, GET /plans/:id
 */
export interface PlanService {
  listPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan>;
}

export const planService: PlanService = {
  async listPlans() {
    await delay(200, 400);
    return mockPlans;
  },

  async getPlan(id) {
    await delay(150, 300);
    const plan = mockPlans.find((p) => p.id === id);
    if (!plan) throw new ServiceError("Plan not found.", 404);
    return plan;
  },
};
