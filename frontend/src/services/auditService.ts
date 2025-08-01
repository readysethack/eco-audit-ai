import api from "@/lib/axios"

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

export interface ApiData {
  business_type: string;
  location: string;
  products: string[];
}

export async function submitAudit(formData: FormData): Promise<AuditResult> {
  // Format data for Flask backend API
  const apiData: ApiData = {
    business_type: formData.businessType,
    location: formData.location,
    products: formData.products.split(",").map((p) => p.trim()),
  }

  const response = await api.post("/audit/list", apiData)
  return response.data
}

export async function getAuditHistory(): Promise<Array<{ id: string; name: string }>> {
  // Use axios headers to prevent caching instead of query params
  const response = await api.get('/audit/list', {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  })
  
  if (response.status === 200) {
    return response.data.audits?.map((audit: AuditResult) => ({
      id: audit.id,
      name: audit.business_name,
    })) || []
  }
  
  return []
}

export async function getAuditById(auditId: string): Promise<AuditResult> {
  const response = await api.get(`/audit/${auditId}`)
  return response.data
}
