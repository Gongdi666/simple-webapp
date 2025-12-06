import React, { useState } from "react";
import "./ProjectForm.css";

type Props = {
  onSubmit: (form: any) => void;
};

const ProjectForm: React.FC<Props> = ({ onSubmit }) => {
  const [form, setForm] = useState({
    rawMemo: "",
    title: "",
    client: "",
    techStack: "",
    unitPrice: "",
    workStyle: "",
    imageUrl: "",
    summary: "",
    description: "",
    sortOrder: "",
  });

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
      sortOrder: form.sortOrder ? Number(form.sortOrder) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <h2 className="form-title">案件登録</h2>

      <label>ざっくりメモ（AI整形用）</label>
      <textarea
        value={form.rawMemo}
        onChange={(e) => update("rawMemo", e.target.value)}
        placeholder="営業メモを貼り付けてください"
      />

      <label>タイトル</label>
      <input
        value={form.title}
        onChange={(e) => update("title", e.target.value)}
        placeholder="案件タイトル"
      />

      <label>クライアント</label>
      <input
        value={form.client}
        onChange={(e) => update("client", e.target.value)}
        placeholder="顧客名"
      />

      <label>技術スタック</label>
      <input
        value={form.techStack}
        onChange={(e) => update("techStack", e.target.value)}
        placeholder="Java, Spring Boot, React など"
      />

      <label>単価</label>
      <input
        type="number"
        value={form.unitPrice}
        onChange={(e) => update("unitPrice", e.target.value)}
        placeholder="例: 750000"
      />

      <label>勤務形態</label>
      <input
        value={form.workStyle}
        onChange={(e) => update("workStyle", e.target.value)}
        placeholder="フルリモート / 常駐 など"
      />

      <label>画像URL（任意）</label>
      <input
        value={form.imageUrl}
        onChange={(e) => update("imageUrl", e.target.value)}
        placeholder="画像URLを指定できます"
      />

      <label>サマリー（短め概要）</label>
      <textarea
        value={form.summary}
        onChange={(e) => update("summary", e.target.value)}
        placeholder="短い案件サマリー（AI整形で補完可能）"
      />

      <label>詳細説明</label>
      <textarea
        value={form.description}
        onChange={(e) => update("description", e.target.value)}
        placeholder="案件の詳細説明（AI整形で補完可能）"
      />

      <label>表示順（任意）</label>
      <input
        type="number"
        value={form.sortOrder}
        onChange={(e) => update("sortOrder", e.target.value)}
      />

      <button type="submit" className="submit-btn">
        登録する
      </button>
    </form>
  );
};

export default ProjectForm;