"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ScrollText } from "lucide-react";
import { DataTable, type ColumnDef } from "@/shared/components/common/DataTable";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Input } from "@/shared/components/ui/input";
import type { AuditLogEntry } from "../types";

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  loading?: boolean;
}

export function AuditLogViewer({ logs, loading }: AuditLogViewerProps) {
  const [actionFilter, setActionFilter] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("");

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (
        actionFilter &&
        !log.action.toLowerCase().includes(actionFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        entityTypeFilter &&
        !log.entityType.toLowerCase().includes(entityTypeFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [logs, actionFilter, entityTypeFilter]);

  const columns: ColumnDef<AuditLogEntry>[] = [
    {
      header: "Time",
      cell: (row) => (
        <span className="whitespace-nowrap text-sm tabular-nums">
          {format(new Date(row.timestamp), "MMM d, HH:mm:ss")}
        </span>
      ),
    },
    {
      header: "Actor",
      cell: (row) => (
        <span className="font-medium">
          {row.actor.name}{" "}
          <span className="text-muted-foreground">({row.actor.cbjNumber})</span>
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "action",
    },
    {
      header: "Entity Type",
      accessorKey: "entityType",
    },
    {
      header: "Entity ID",
      cell: (row) => (
        <span className="max-w-[200px] truncate text-xs text-muted-foreground">
          {row.entityId}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          placeholder="Filter by action..."
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="max-w-[200px]"
        />
        <Input
          placeholder="Filter by entity type..."
          value={entityTypeFilter}
          onChange={(e) => setEntityTypeFilter(e.target.value)}
          className="max-w-[200px]"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredLogs}
        loading={loading}
        striped
        emptyState={
          <EmptyState
            icon={ScrollText}
            title="No Audit Logs"
            description="No activity has been recorded yet."
          />
        }
      />
    </div>
  );
}
