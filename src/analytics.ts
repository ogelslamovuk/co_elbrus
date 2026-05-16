declare global {
  interface Window {
    ym?: (counterId: number | string, method: "reachGoal", goalName: string) => void;
    __YANDEX_METRIKA_ID__?: number | string;
  }
}

export const YANDEX_METRIKA_ID = 109248707;

export function trackGoal(goalName: string) {
  if (typeof window === "undefined") return;

  const ym = window.ym;
  const counterId = window.__YANDEX_METRIKA_ID__ ?? YANDEX_METRIKA_ID;

  if (typeof ym === "function" && counterId) {
    ym(counterId, "reachGoal", goalName);
  }
}
