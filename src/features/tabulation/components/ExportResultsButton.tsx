"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { exportResults } from "../actions";

interface ExportResultsButtonProps {
  competitionId: string;
}

export function ExportResultsButton({
  competitionId,
}: ExportResultsButtonProps) {
  const [exporting, setExporting] = useState(false);

  async function handleExport(format: "csv" | "json") {
    try {
      setExporting(true);
      const data = await exportResults(competitionId, format);
      const mimeType = format === "csv" ? "text/csv" : "application/json";
      const ext = format;

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `results.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("csv")}
        disabled={exporting}
      >
        <Download className="mr-1 h-4 w-4" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport("json")}
        disabled={exporting}
      >
        <Download className="mr-1 h-4 w-4" />
        JSON
      </Button>
    </div>
  );
}
