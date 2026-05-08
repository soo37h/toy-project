import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from './hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function Login() {
  const { login } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <Card className="w-full max-w-[400px] shadow-lg border-0 bg-card">
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold">
              AX
            </div>
            <h1 className="text-xl font-bold tracking-tight">로그인</h1>
            <p className="mt-1 text-sm text-muted-foreground">계정에 로그인하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11 gap-2 rounded-full">
              <LogIn className="h-4 w-4" />
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                회원가입
              </Link>
            </p>
          </div>

          {/* Mock 안내 */}
          <div className="mt-6 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground text-center">
              테스트 계정: <code className="text-primary">admin@example.com</code> / <code className="text-primary">password123</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
