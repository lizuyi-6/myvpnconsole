import { api } from "@/lib/api-client";
import type { Plan } from "@/types";

/**
 * Plan catalog.
 * API: GET /plans, GET /plans/:id
 */
export interface PlanService {
  listPlans(): Promise<Plan[]>;
  getPlan(id: string): Promise<Plan>;
}

export const planService: PlanService = {
  listPlans() {
    return api<Plan[]>("/plans");
  },

  getPlan(id) {
    return api<Plan>(`/plans/${encodeURIComponent(id)}`);
  },
};
