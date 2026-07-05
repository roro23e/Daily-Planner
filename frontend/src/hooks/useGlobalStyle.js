import { useEffect } from "react";
import { GLOBAL_CSS } from "../data/constants.js";

export function useGlobalStyle() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
}
