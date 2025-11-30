declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export {};

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";

export const pageview = (url: string) => {
  if (!GA4_ID || typeof window === "undefined") return;
  window.gtag?.("event", "page_view", {
    page_location: url,
  });
};

type GtagEventParams = {
  [key: string]: string | number | boolean | null | undefined;
};

export const gaEvent = (name: string, params?: GtagEventParams) => {
  if (!GA4_ID || typeof window === "undefined") return;
  window.gtag?.("event", name, params);
};