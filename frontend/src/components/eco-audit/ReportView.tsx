"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Define AuditResult interface locally as a workaround for path resolution issues
interface AuditResult {
  id: string;
  created: string;
  business_name: string;
  sustainability_score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

interface ReportViewProps {
  auditResult: AuditResult;
  onStartNewAudit: () => void;
}

export default function ReportView({ auditResult, onStartNewAudit }: ReportViewProps) {
  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+"
    if (score >= 85) return "A"
    if (score >= 80) return "B+"
    if (score >= 75) return "B"
    if (score >= 70) return "B-"
    if (score >= 65) return "C+"
    if (score >= 60) return "C"
    if (score >= 50) return "D"
    return "F"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent"
    if (score >= 75) return "Good"
    if (score >= 65) return "Fair"
    if (score >= 50) return "Needs Improvement"
    return "Critical"
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 65) return "text-yellow-600"
    if (score >= 50) return "text-orange-600"
    return "text-red-600"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

        {/* Report Header Card */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Sustainability Report</span>
              <span className="text-sm font-normal text-muted-foreground">
                {formatDate(auditResult.created)}
              </span>
            </CardTitle>
            <p className="text-lg font-medium">{auditResult.business_name}</p>
          </CardHeader>
        </Card>

        {/* Score Overview */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <CardHeader>
            <CardTitle>Overall Sustainability Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`text-4xl font-bold ${getScoreColor(auditResult.sustainability_score)}`}>
                  {auditResult.sustainability_score}
                </div>
                <div>
                  <div className={`text-xl font-semibold ${getScoreColor(auditResult.sustainability_score)}`}>
                    {getScoreGrade(auditResult.sustainability_score)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getScoreLabel(auditResult.sustainability_score)}
                  </div>
                </div>
              </div>
            </div>
            <Progress 
              value={auditResult.sustainability_score} 
              className="h-3" 
            />
            <p className="text-sm text-muted-foreground">
              Score out of 100 based on sustainability practices and environmental impact
            </p>
          </CardContent>
        </Card>

        {/* Strengths Section */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader>
            <CardTitle className="text-green-600">Key Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResult.strengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm font-semibold">{index + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Improvements Section */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <CardHeader>
            <CardTitle className="text-blue-600">Recommended Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {auditResult.improvements.map((improvement, index) => {
                const impactLevels = ["High Impact", "Medium Impact", "Low Impact"]
                const impactColors = ["text-red-600", "text-yellow-600", "text-green-600"]
                const impactBgs = ["bg-red-100", "bg-yellow-100", "bg-green-100"]
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColors[index]} ${impactBgs[index]}`}>
                            {impactLevels[index] || "Standard Impact"}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{improvement}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expert Tip */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center space-x-2">
              <span>💡</span>
              <span>Expert Tip</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 leading-relaxed">{auditResult.tip}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
