"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Define FormData interface locally as a workaround for path resolution issues
interface FormData {
  businessName: string;
  businessType: string;
  location: string;
  products: string;
}

interface AuditFormProps {
  onSubmit: (formData: FormData) => void;
  onHistoryClick: () => void;
  historyOpen: boolean;
  historyLoading: boolean;
  historyData: Array<{ id: string; name: string }>;
  onHistoryItemClick: (auditId: string, auditName: string) => void;
}

export default function AuditForm({
  onSubmit,
  onHistoryClick,
  historyOpen,
  historyLoading,
  historyData,
  onHistoryItemClick
}: AuditFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    businessType: "",
    location: "",
    products: "",
  })

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
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
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
      case 3:
        return "Location & Products"
      default:
        return "Business Information"
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
  }, [currentStep, formData])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-in fade-in duration-500">
          <h1 className="text-lg font-semibold">[EcoAudit.AI]</h1>
          <HistoryMenu 
            historyOpen={historyOpen} 
            onHistoryClick={onHistoryClick}
            historyLoading={historyLoading}
            historyData={historyData}
            onHistoryItemClick={onHistoryItemClick}
          />
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

function HistoryMenu({ 
  historyOpen, 
  onHistoryClick, 
  historyLoading, 
  historyData, 
  onHistoryItemClick 
}: { 
  historyOpen: boolean;
  onHistoryClick: () => void;
  historyLoading: boolean;
  historyData: Array<{ id: string; name: string }>;
  onHistoryItemClick: (auditId: string, auditName: string) => void;
}) {
  return (
    <DropdownMenu open={historyOpen} onOpenChange={onHistoryClick}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="transition-all hover:scale-105 bg-transparent"
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
              onClick={() => onHistoryItemClick(audit.id, audit.name)}
              className="cursor-pointer hover:bg-accent transition-colors"
            >
              {audit.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
