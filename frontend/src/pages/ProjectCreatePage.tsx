import React, { useState } from "react";
import ProjectForm from "../components/ProjectForm";
import { createProject } from "../api/projects";

interface Props {
  token?: string; // props は残すが、実際には localStorage を使う
}

const ProjectCreatePage: React.FC<Props> = ({ token }) => {
  const [toast, setToast] = useState<string | null>(null);

  // ★ localStorage から token を取得（← 必要最低限の修正）
  const authToken = token ?? localStorage.getItem("token") ?? "";

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 1600);
  };

  const handleSubmit = async (form: any) => {

    try {
      await createProject(form, authToken);
      showToast("案件を登録しました！");
    } catch (err) {
      console.error(err);
      showToast("登録に失敗しました…");
    }
  };

  return (
    <>
      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        <ProjectForm onSubmit={handleSubmit} />
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "12px 22px",
            borderRadius: 999,
            background:
              "linear-gradient(135deg, rgba(96,165,250,0.95), rgba(244,114,182,0.95))",
            color: "#020617",
            fontSize: "0.9rem",
            fontWeight: 600,
            boxShadow: "0 18px 40px rgba(15,23,42,0.9)",
            zIndex: 99999,
            whiteSpace: "nowrap",
            transition: "opacity 0.2s ease",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
};

export default ProjectCreatePage;