import { useState, useCallback } from "react";
import { uid } from "../data/helpers.js";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = "info") => {
    const id = uid();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = useCallback(id => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}
