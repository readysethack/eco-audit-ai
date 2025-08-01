"use client"

import { useState } from "react"
import { submitAudit, getAuditHistory, getAuditById } from "@/services/auditService"
import { useLoadingAnimation } from "@/hooks/useLoadingAnimation"

// Define types locally as a workaround for path resolution issues
interface FormData {
  businessName: string;
  businessType: string;
  location: string;
  products: string;
}

interface AuditResult {
  id: string;
  created: string;
  business_name: string;
  sustainability_score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

type ViewState = "form" | "loading" | "report" | "reportSkeleton";

// Components
import AuditForm from "@/components/eco-audit/AuditForm"
import LoadingView from "@/components/eco-audit/LoadingView"
import ReportView from "@/components/eco-audit/ReportView"
import ReportSkeleton from "@/components/eco-audit/ReportSkeleton"

export default function EcoAuditApp() {
  // State
  const [viewState, setViewState] = useState<ViewState>("form")
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null)
  
  // History state
  const [historyOpen, setHistoryOpen] = useState(false)
  const [historyData, setHistoryData] = useState<Array<{ id: string; name: string }>>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Loading animation
  const { loadingProgress, loadingText, simulateLoading } = useLoadingAnimation()

  // Handle form submission
  const handleSubmit = async (data: FormData) => {
    setViewState("loading")
    simulateLoading()

    try {
      const result = await submitAudit(data)
      
      // Clear history cache so it will be refetched with the new audit
      setHistoryData([])
      
      // Set result immediately when API responds, regardless of loading animation
      setAuditResult(result)
      setViewState("report")
    } catch (error) {
      console.error("Error submitting to Flask API:", error)
      setViewState("form")
    }
  }

  // Handle history dropdown
  const handleHistoryClick = () => {
    const newState = !historyOpen
    setHistoryOpen(newState)
    
    // Always fetch fresh data when opening the history
    if (newState) {
      fetchHistory()
    }
  }

  // Fetch audit history
  const fetchHistory = async () => {
    // Always fetch fresh data when requested
    setHistoryLoading(true)
    try {
      const historyItems = await getAuditHistory()
      // Limit to latest 5 audits
      setHistoryData(historyItems.slice(0, 5))
    } catch (error) {
      console.error("Error fetching history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Handle history item selection
  const handleHistoryItemClick = (auditId: string, auditName: string) => {
    console.log("Selected audit:", auditId, auditName)
    setHistoryOpen(false)
    
    // Fetch the specific audit with skeleton loading
    fetchAuditById(auditId)
  }
  
  // Fetch a specific audit by ID
  const fetchAuditById = async (auditId: string) => {
    setViewState("reportSkeleton")
    
    try {
      const result = await getAuditById(auditId)
      
      // Add a small delay to show skeleton for better UX
      setTimeout(() => {
        setAuditResult(result)
        setViewState("report")
      }, 800)
    } catch (error) {
      console.error("Error fetching audit details:", error)
      setViewState("form")
    }
  }

  // Start a new audit
  const handleStartNewAudit = () => {
    setViewState("form")
    setAuditResult(null)
    // Clear history cache so it will be refetched with latest data
    setHistoryData([])
  }

  // Render the current view based on state
  if (viewState === "loading") {
    return (
      <LoadingView
        onHistoryClick={handleHistoryClick}
        historyOpen={historyOpen}
        historyLoading={historyLoading}
        historyData={historyData}
        onHistoryItemClick={handleHistoryItemClick}
        loadingProgress={loadingProgress}
        loadingText={loadingText}
      />
    )
  }

  if (viewState === "reportSkeleton") {
    return (
      <ReportSkeleton
        onStartNewAudit={handleStartNewAudit}
      />
    )
  }

  if (viewState === "report" && auditResult) {
    return (
      <ReportView
        auditResult={auditResult}
        onStartNewAudit={handleStartNewAudit}
      />
    )
  }

  // Default: Form view
  return (
    <AuditForm
      onSubmit={handleSubmit}
      onHistoryClick={handleHistoryClick}
      historyOpen={historyOpen}
      historyLoading={historyLoading}
      historyData={historyData}
      onHistoryItemClick={handleHistoryItemClick}
    />
  )
}