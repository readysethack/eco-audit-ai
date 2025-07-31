"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface FormData {
  businessName: string
  businessType: string
  location: string
  products: string
}

interface AuditResult {
  id: string
  created: string
  business_name: string
  sustainability_score: number
  strengths: string[]
  improvements: string[]
  tip: string
}

type ViewState = "form" | "loading" | "report"

export default function EcoAuditForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [viewState, setViewState] = useState<ViewState>("form")
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    location: "",
    products: "",
  })
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Analyzing Your Data...")

  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState<Array<{ id: string; name: string }>>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const totalSteps = 3
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const simulateLoading = () => {
    const loadingSteps = [
      { text: "Cross-referencing regional energy grids...", duration: 2000 },
      { text: "Evaluating local supply chain emissions...", duration: 2000 },
      { text: "Compiling your personalized sustainability report...", duration: 2000 },
    ]

    let currentStepIndex = 0
    setLoadingProgress(0)

    const runStep = () => {
      if (currentStepIndex < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStepIndex].text)

        const stepDuration = loadingSteps[currentStepIndex].duration
        const progressIncrement = 100 / loadingSteps.length
        const startProgress = currentStepIndex * progressIncrement
        const endProgress = (currentStepIndex + 1) * progressIncrement

        let elapsed = 0
        const interval = setInterval(() => {
          elapsed += 50
          const stepProgress = Math.min(elapsed / stepDuration, 1)
          setLoadingProgress(startProgress + stepProgress * progressIncrement)

          if (elapsed >= stepDuration) {
            clearInterval(interval)
            currentStepIndex++
            runStep()
          }
        }, 50)
      }
    }

    runStep()
  }

  const handleSubmit = async () => {
    setViewState("loading")
    simulateLoading()

    // Format data for Flask backend API
    const apiData = {
      business_type: formData.businessType,
      location: formData.location,
      products: formData.products.split(",").map((p) => p.trim()),
    }

    try {
      const response = await fetch("/audit/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      if (response.ok) {
        const result = await response.json()

        // Wait for loading animation to complete
        setTimeout(() => {
          setAuditResult(result)
          setViewState("report")
        }, 6000)
      } else {
        console.error("Failed to submit to Flask API")
        setViewState("form")
      }
    } catch (error) {
      console.error("Error submitting to Flask API:", error)
      setViewState("form")
    }
  }

  const fetchHistory = async () => {
    if (historyData.length > 0) return

    setHistoryLoading(true)
    try {
      const response = await fetch("/audit/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setHistoryData(
          data.audits?.map((audit: AuditResult) => ({
            id: audit.id,
            name: audit.business_name,
          })) || [],
        )
      } else {
        console.error("Failed to fetch history")
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleHistoryItemClick = (auditId: string, auditName: string) => {
    console.log("Selected audit:", auditId, auditName)
    setHistoryOpen(false)
  }

  const handleStartNewAudit = () => {
    setViewState("form")
    setCurrentStep(1)
    setFormData({
      businessName: "",
      businessType: "",
      location: "",
      products: "",
    })
    setAuditResult(null)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim() !== ""
      case 2:
        return formData.businessType.trim() !== ""
      case 3:
        return formData.location.trim() !== "" && formData.products.trim() !== ""
      default:
        return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Business Information"
      case 2:
        return "Business Type"
      case 3:
        return "Location & Products"
      default:
        return ""
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
              />
              <p className="text-sm text-muted-foreground">Enter the legal name of your business.</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange("businessType", e.target.value)}
                placeholder="e.g., Restaurant, Retail Store, Manufacturing..."
              />
              <p className="text-sm text-muted-foreground">Enter the type of business you operate.</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Business Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, State/Country"
                />
                <p className="text-sm text-muted-foreground">Enter your primary business location.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="products">Products/Offerings</Label>
                <Textarea
                  id="products"
                  value={formData.products}
                  onChange={(e) => handleInputChange("products", e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Product 1, Product 2, Service A, Service B..."
                />
                <p className="text-sm text-muted-foreground">
                  List your main products or services, separated by commas.
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewState !== "form") return

      if (e.key === "Enter" && isStepValid()) {
        e.preventDefault()
        if (currentStep === totalSteps) {
          handleSubmit()
        } else {
          handleNext()
        }
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [currentStep, formData, viewState])

  if (viewState === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-cyan-400 font-mono p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="border border-cyan-400 p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-cyan-400">[EcoAudit.AI]</span>
              <DropdownMenu open={historyOpen} onOpenChange={setHistoryOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-red-400 hover:text-red-300 transition-colors"
                    onClick={() => {
                      if (!historyOpen) {
                        fetchHistory()
                      }
                    }}
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
                        onClick={() => handleHistoryItemClick(audit.id, audit.name)}
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

  if (viewState === "report" && auditResult) {
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
                <button className="text-red-400 hover:text-red-300 transition-colors" onClick={handleStartNewAudit}>
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

  // Form View (default)
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-in fade-in duration-500">
          <h1 className="text-lg font-semibold">[EcoAudit.AI]</h1>
          <DropdownMenu open={historyOpen} onOpenChange={setHistoryOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all hover:scale-105 bg-transparent"
                onClick={() => {
                  if (!historyOpen) {
                    fetchHistory()
                  }
                }}
              >
                [Show History]
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {historyLoading ? (
                <DropdownMenuItem disabled>Loading history...</DropdownMenuItem>
              ) : historyData.length === 0 ? (
                <DropdownMenuItem disabled>No previous audits found</DropdownMenuItem>
              ) : (
                historyData.map((audit) => (
                  <DropdownMenuItem
                    key={audit.id}
                    onClick={() => handleHistoryItemClick(audit.id, audit.name)}
                    className="cursor-pointer hover:bg-accent transition-colors"
                  >
                    {audit.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Form Container */}
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader>
            <CardTitle className="transition-all duration-300">{getStepTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div key={currentStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
              {renderStepContent()}
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progress:</span>
                <span className="text-sm text-muted-foreground transition-all duration-300">
                  {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 transition-all duration-500" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="transition-all hover:scale-105 disabled:hover:scale-100 bg-transparent"
              >
                ← Back
              </Button>

              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="transition-all hover:scale-105 disabled:hover:scale-100"
                >
                  Next →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}