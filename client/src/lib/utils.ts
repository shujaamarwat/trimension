import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getLocalStorage = (key: string): any =>
  JSON.parse(window.localStorage.getItem(key) || "null");
const setLocalStorage = (key: string, value: any): void =>
  window.localStorage.setItem(key, JSON.stringify(value));

export { getLocalStorage, setLocalStorage };

// Environment helpers for client code
export const env = {
  mode: import.meta.env.MODE,
  nodeEnv: (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) ? process.env.NODE_ENV : (import.meta.env.PROD ? 'production' : 'development'),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD
} as const;
