"use client";

import { BuildInfo } from "@/types/ai-response";
import { CheckCircle, XCircle } from "lucide-react";

interface BuildPanelProps {
  build: BuildInfo;
}

export function BuildPanel({ build }: BuildPanelProps) {
  if (!build) {
    return (
      <div className="p-4 text-muted-foreground text-sm">
        No build information available
      </div>
    );
  }

  const isSuccess = build.status === 'success';

  return (
    <div className="space-y-3">
      {/* Status */}
      <div
        className={`p-3 rounded-md border ${
          isSuccess
            ? "bg-green-500/10 border-green-500/30"
            : "bg-red-500/10 border-red-500/30"
        }`}
      >
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`font-semibold ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            Build {isSuccess ? "Successful" : "Failed"}
          </span>
        </div>
      </div>

      {/* Build Details */}
      {isSuccess && (
        <div className="grid grid-cols-2 gap-3">
          {build.time && (
            <div className="p-3 bg-card border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Build Time</p>
              <p className="text-sm font-mono font-semibold text-foreground mt-1">
                {build.time}
              </p>
            </div>
          )}
          {build.outputFile && (
            <div className="p-3 bg-card border border-border rounded-md">
              <p className="text-xs text-muted-foreground">Output File</p>
              <p className="text-sm font-mono font-semibold text-foreground mt-1">
                {build.outputFile}
              </p>
            </div>
          )}
          {build.size && (
            <div className="p-3 bg-card border border-border rounded-md col-span-2">
              <p className="text-xs text-muted-foreground">File Size</p>
              <p className="text-sm font-mono font-semibold text-foreground mt-1">
                {build.size}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Symbol Table */}
      {build.symbols && build.symbols.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Symbol Table</p>
          <div className="border border-border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Segment
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Offset
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {build.symbols.map((symbol, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-border hover:bg-secondary/30"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {symbol.segment}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-primary">
                        {symbol.name}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {symbol.type}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {symbol.offset}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-foreground">
                        {symbol.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
