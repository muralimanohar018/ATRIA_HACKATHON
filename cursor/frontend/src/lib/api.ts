import axios from "axios";

export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
export const api = axios.create({ 
  baseURL: API_BASE,
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Job {
  id: number;
  title: string;
  location: string;
  description: string;
}

export interface ApplicationResponse {
  application_id: number;
  match: {
    match_score: number;
    matched_skills: string[];
    analysis: string;
  };
  email_sent: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  created_at: string;
}

export const apiRoutes = {
  health: () => api.get("/health"),
  jobs: {
    list: () => api.get("/jobs"),
  },
  apply: (data: {
    name: string;
    email: string;
    phone?: string;
    job_id: number;
    resume_text: string;
  }) => api.post<{ success: boolean; data: ApplicationResponse }>("/apply", data),
  blogs: {
    list: () => api.get<{ success: boolean; data: BlogPost[] }>("/blogs"),
    create: (data: { title: string; content: string }) =>
      api.post<{ success: boolean; data: BlogPost }>("/blogs", data),
  },
  ai: {
    summarize: (text: string) =>
      api.post<{ success: boolean; data: { summary: string } }>("/ai/summarize", { text }),
    jobMatch: (resume_text: string, job_description: string) =>
      api.post("/ai/job-match", { resume_text, job_description }),
    emailPreview: (name: string, kind: string, job_title?: string) =>
      api.post("/ai/email/preview", { name, kind, job_title }),
    uploadResume: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return api.post<{ success: boolean; data: { text: string; fields: any; filename: string } }>(
        "/ai/upload-resume",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    },
    generateResume: (resumeData: any, template: string) =>
      api.post("/ai/generate-resume", { resume_data: resumeData, template }),
    generateResumePDF: (resumeData: any, template: string) =>
      api.post("/ai/generate-resume-pdf", { resume_data: resumeData, template }, { responseType: 'blob' }),
  },
  admin: {
    jobs: {
      create: (data: { title: string; description: string; location?: string }) =>
        api.post("/admin/jobs", data),
      list: () => api.get("/admin/jobs"),
    },
    applications: {
      list: () => api.get("/admin/applications"),
    },
    blogs: {
      create: (data: { title: string; content: string }) =>
        api.post("/admin/blogs", data),
    },
  },
  auth: {
    login: (username: string, password: string) =>
      api.post("/auth/login", { username, password }),
    logout: () => api.post("/auth/logout"),
    verify: () => {
      const token = localStorage.getItem('admin_token')
      return api.get("/auth/verify", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: token ? { token } : {}
      })
    },
    register: (username: string, email: string, password: string) =>
      api.post("/auth/register", { username, email, password }),
  },
  contact: {
    submit: (data: { name: string; email: string; message: string }) =>
      api.post("/contact", data),
  },
  testimonials: {
    list: () => api.get("/testimonials"),
    create: (data: { raw_text: string; author?: string }) =>
      api.post("/testimonials", data),
  },
  caseStudies: {
    list: () => api.get("/case-studies"),
    analyze: (data: { content: string }) =>
      api.post("/case-studies/analyze", data),
  },
  admin: {
    ...apiRoutes.admin,
    analytics: () => api.get("/admin/analytics"),
  },
};

