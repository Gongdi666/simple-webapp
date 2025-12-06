// src/api/projects.ts
export type CreateProjectRequest = {
  rawMemo?: string;
  title?: string;
  client?: string;
  techStack?: string;
  unitPrice?: number;
  workStyle?: string;
  imageUrl?: string;
  summary?: string;
  description?: string;
  sortOrder?: number;
};

export async function createProject(data: CreateProjectRequest, token: string) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "unknown error");
    console.error("CreateProject ERROR:", errorText);
    throw new Error(errorText);
  }

  return res.json();
}