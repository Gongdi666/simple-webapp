// frontend/src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken } from "./api";
import LoginForm from "./components/LoginForm";
import MenuPage from "./pages/MenuPage";
import SwipePage from "./pages/SwipePage";
import ProjectCreatePage from "./pages/ProjectCreatePage";

const App: React.FC = () => {
  const isLoggedIn = !!getToken();

  return (
    <Routes>
      {/* 未ログインなら login へ */}
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/menu" /> : <LoginForm onLoggedIn={() => {}} />}
      />

      <Route path="/login" element={<LoginForm onLoggedIn={() => {}} />} />

      {/* ログイン後のメニュー画面 */}
      <Route path="/menu" element={<MenuPage />} />

      {/* スワイプ画面 */}
      <Route path="/swipe" element={<SwipePage />} />

      {/* 案件登録画面 */}
      <Route path="/project/create" element={<ProjectCreatePage />} />

      {/* 存在しない URL は menu へ */}
      <Route path="*" element={<Navigate to="/menu" />} />
    </Routes>
  );
};

export default App;