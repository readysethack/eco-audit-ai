"use client"

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
    if (score >= 9) return "A+"
    if (score >= 8.5) return "A"
    if (score >= 8) return "B+"
    if (score >= 7.5) return "B"
    if (score >= 7) return "B-"
    if (score >= 6.5) return "C+"
    if (score >= 6) return "C"
    return "D"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 8.5) return "Excellent"
    if (score >= 7.5) return "Good"
    if (score >= 6.5) return "Fair"
    return "Needs Improvement"
  }

  return (
    <div className="min-h-screen bg-gray-900 text-cyan-400 font-mono p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="border border-cyan-400 p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-cyan-400">[EcoAudit.AI]</span>
            <div className="space-x-4">
              <button className="text-red-400 hover:text-red-300 transition-colors">[Download PDF]</button>
              <button className="text-red-400 hover:text-red-300 transition-colors" onClick={onStartNewAudit}>
                [Start New Audit]
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="border border-cyan-400 p-6 space-y-6">
          {/* Report Title */}
          <div>
            <span className="text-yellow-400">Report for:</span> {auditResult.business_name}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className="border border-cyan-400 p-4 text-center">
              <div className="text-sm mb-2">OVERALL ECO SCORE</div>
              <div className="text-2xl font-bold">{getScoreGrade(auditResult.sustainability_score)}</div>
              <div className="text-sm">({getScoreLabel(auditResult.sustainability_score)})</div>
            </div>

            {/* Key Metrics */}
            <div className="border border-cyan-400 p-4">
              <div className="text-sm mb-4">KEY METRICS (vs. Regional Avg)</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Energy Usage:</span>
                  <span className="text-green-400">[+15%] ▲</span>
                </div>
                <div className="flex justify-between">
                  <span>• Waste Diversion:</span>
                  <span className="text-red-400">[-8%] ▼</span>
                </div>
                <div className="flex justify-between">
                  <span>• Water Purity:</span>
                  <span className="text-green-400">[+2%] ▲</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Insights */}
          <div>
            <div className="text-yellow-400 mb-4">Actionable Insights</div>
            <div className="border-b border-cyan-400 mb-4"></div>

            <div className="space-y-4">
              {auditResult.improvements.slice(0, 3).map((improvement, index) => {
                const impacts = ["HIGH IMPACT", "MEDIUM IMPACT", "LOW IMPACT"]
                const colors = ["text-red-400", "text-yellow-400", "text-green-400"]

                return (
                  <div key={index} className="space-y-1">
                    <div>
                      <span className="text-cyan-400">{index + 1}.</span>{" "}
                      <span className={colors[index]}>[{impacts[index]}]</span> <span>{improvement}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
