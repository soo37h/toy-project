import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BoardList from '@/pages/board/BoardList';
import BoardDetail from '@/pages/board/BoardDetail';
import BoardForm from '@/pages/board/BoardForm';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* / → 게시판으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/boards" replace />} />

          {/* 게시판 */}
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/new" element={<BoardForm />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/boards/:id/edit" element={<BoardForm />} />

          {/* 인증 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
