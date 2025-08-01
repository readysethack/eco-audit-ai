"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ReportSkeletonProps {
  onStartNewAudit: () => void;
}

export default function ReportSkeleton({ onStartNewAudit }: ReportSkeletonProps) {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center animate-in fade-in duration-500">
          <h1 className="text-lg font-semibold">[EcoAudit.AI]</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="transition-all hover:scale-105"
            >
              Download PDF
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onStartNewAudit}
              className="transition-all hover:scale-105"
            >
              Start New Audit
            </Button>
          </div>
        </div>

        {/* Report Header Card Skeleton */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
              <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
            </div>
            <div className="h-6 bg-muted rounded animate-pulse w-64 mt-2"></div>
          </CardHeader>
        </Card>

        {/* Score Overview Skeleton */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-muted rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded animate-pulse w-12"></div>
                <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
              </div>
            </div>
            <div className="h-3 bg-muted rounded animate-pulse w-full"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
          </CardContent>
        </Card>

        {/* Strengths Section Skeleton */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-muted animate-pulse flex-shrink-0 mt-0.5"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvements Section Skeleton */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardHeader>
            <div className="h-6 bg-muted rounded animate-pulse w-48"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-muted animate-pulse flex-shrink-0 mt-0.5"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-muted rounded-full animate-pulse w-24"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expert Tip Skeleton */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <span>💡</span>
              <div className="h-6 bg-amber-200 rounded animate-pulse w-24"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-4 bg-amber-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-amber-200 rounded animate-pulse w-4/5"></div>
              <div className="h-4 bg-amber-200 rounded animate-pulse w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
