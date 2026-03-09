"use client";

import { Minus, Plus } from "lucide-react";

interface FontSizeControlProps {
  fontSize: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function FontSizeControl({
  fontSize,
  onIncrease,
  onDecrease,
}: FontSizeControlProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-1">Font Size</span>
      <button
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-accent active:scale-95"
        aria-label="Decrease font size"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-xs tabular-nums">{fontSize}</span>
      <button
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-accent active:scale-95"
        aria-label="Increase font size"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
