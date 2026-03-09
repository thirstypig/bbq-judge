"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bbq-judge-font-size";
const DEFAULT_SIZE = 16;
const MIN_SIZE = 14;
const MAX_SIZE = 24;
const STEP = 2;

export function useFontSize() {
  const [fontSize, setFontSize] = useState(DEFAULT_SIZE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIZE && parsed <= MAX_SIZE) {
        setFontSize(parsed);
      }
    }
  }, []);

  const persist = useCallback((size: number) => {
    setFontSize(size);
    localStorage.setItem(STORAGE_KEY, String(size));
  }, []);

  const increase = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.min(prev + STEP, MAX_SIZE);
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const decrease = useCallback(() => {
    setFontSize((prev) => {
      const next = Math.max(prev - STEP, MIN_SIZE);
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    persist(DEFAULT_SIZE);
  }, [persist]);

  return { fontSize, increase, decrease, reset };
}
