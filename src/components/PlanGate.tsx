type Plan = "free" | "standard" | "pro";

const order: Plan[] = ["free", "standard", "pro"];

export default function PlanGate({
  plan,
  minPlan,
  children,
  fallback = null,
}: {
  plan: Plan;
  minPlan: Plan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const allowed = order.indexOf(plan) >= order.indexOf(minPlan);
  return <>{allowed ? children : fallback}</>;
}