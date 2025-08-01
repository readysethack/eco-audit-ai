"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-in fade-in duration-500">
          <h1 className="text-lg font-semibold">[EcoAudit.AI]</h1>
          <DropdownMenu open={historyOpen} onOpenChange={onHistoryClick}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all hover:scale-105"
              >
                Show History
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {historyLoading ? (
                <DropdownMenuItem disabled>
                  Loading history...
                </DropdownMenuItem>
              ) : historyData.length === 0 ? (
                <DropdownMenuItem disabled>
                  No previous audits found
                </DropdownMenuItem>
              ) : (
                historyData.map((audit) => (
                  <DropdownMenuItem
                    key={audit.id}
                    onClick={() => onHistoryItemClick(audit.id, audit.name)}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    {audit.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Loading Content */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardContent className="p-8">
            <div className="text-center space-y-8">
              <h2 className="text-xl font-semibold">{loadingText}</h2>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="mx-auto max-w-md">
                  <div className="bg-muted rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round(loadingProgress)}% Complete
                </div>
              </div>

              {/* Terminal-style Status Messages */}
              <Card className="bg-black text-green-400 font-mono text-sm max-w-2xl mx-auto">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span className="animate-pulse">Cross-referencing regional energy grids...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span className={loadingProgress > 33 ? "text-green-400" : "text-gray-600"}>
                      Evaluating local supply chain emissions...
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span className={loadingProgress > 66 ? "text-green-400" : "text-gray-600"}>
                      Compiling your personalized sustainability report...
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">$</span>
                    <span className={loadingProgress > 90 ? "text-green-400 animate-pulse" : "text-gray-600"}>
                      Finalizing recommendations...
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Loading animation */}
              <div className="flex justify-center items-center space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
