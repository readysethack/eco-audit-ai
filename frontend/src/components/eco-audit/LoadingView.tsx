"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface LoadingViewProps {
  onHistoryClick: () => void;
  historyOpen: boolean;
  historyLoading: boolean;
  historyData: Array<{ id: string; name: string }>;
  onHistoryItemClick: (auditId: string, auditName: string) => void;
  loadingProgress: number;
  loadingText: string;
}

export default function LoadingView({
  onHistoryClick,
  historyOpen,
  historyLoading,
  historyData,
  onHistoryItemClick,
  loadingProgress,
  loadingText
}: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border border-cyan-400 p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400">[EcoAudit.AI]</span>
            <DropdownMenu open={historyOpen} onOpenChange={onHistoryClick}>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  [Show History]
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-gray-800 border-cyan-400">
                {historyLoading ? (
                  <DropdownMenuItem disabled className="text-cyan-400">
                    Loading history...
                  </DropdownMenuItem>
                ) : historyData.length === 0 ? (
                  <DropdownMenuItem disabled className="text-cyan-400">
                    No previous audits found
                  </DropdownMenuItem>
                ) : (
                  historyData.map((audit) => (
                    <DropdownMenuItem
                      key={audit.id}
                      onClick={() => onHistoryItemClick(audit.id, audit.name)}
                      className="cursor-pointer hover:bg-gray-700 text-cyan-400"
                    >
                      {audit.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Loading Content */}
        <div className="border border-cyan-400 p-8">
          <div className="text-center space-y-8">
            <h2 className="text-xl">{loadingText}</h2>

            {/* ASCII Progress Bar */}
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-block border border-dashed border-cyan-400 p-4">
                  <div className="flex items-center space-x-1">
                    <span>[</span>
                    <div className="w-64 flex">
                      {Array.from({ length: 24 }, (_, i) => (
                        <span key={i} className="text-cyan-400">
                          {i < (loadingProgress / 100) * 24 ? "█" : "░"}
                        </span>
                      ))}
                    </div>
                    <span>]</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-2 text-left max-w-md mx-auto">
              <div className="text-red-400">Cross-referencing regional energy grids...</div>
              <div className="text-yellow-400">Evaluating local supply chain emissions...</div>
              <div className="text-cyan-400">Compiling your personalized sustainability report...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
