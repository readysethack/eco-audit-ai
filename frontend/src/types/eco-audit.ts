export interface FormData {
  businessName: string;
  businessType: string;
  location: string;
  products: string;
}

export interface AuditResult {
  id: string;
  created: string;
  business_name: string;
  sustainability_score: number;
  strengths: string[];
  improvements: string[];
  tip: string;
}

export type ViewState = "form" | "loading" | "report";
