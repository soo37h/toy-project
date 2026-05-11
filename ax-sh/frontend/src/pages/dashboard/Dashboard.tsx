import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Users, Upload, MessageSquare, ArrowRight } from 'lucide-react';

const stats = [
  { title: '게시글', value: '10', icon: FileText, path: '/boards', color: 'text-primary' },
  { title: '회원', value: '4', icon: Users, path: '/members', color: 'text-blue-500' },
  { title: '댓글', value: '7', icon: MessageSquare, path: '/comments', color: 'text-emerald-500' },
  { title: '파일', value: '5', icon: Upload, path: '/files', color: 'text-amber-500' },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Home</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <Link
                to={stat.path}
                className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                자세히 보기
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Roadmap */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-base font-semibold mb-4">학습 로드맵</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { phase: '1', title: '게시판 CRUD', status: 'current' },
              { phase: '2', title: '인증/인가', status: 'upcoming' },
              { phase: '3', title: '파일 업로드', status: 'upcoming' },
              { phase: '4', title: '댓글/대댓글', status: 'upcoming' },
              { phase: '5', title: '성능 최적화', status: 'upcoming' },
            ].map((item) => (
              <div
                key={item.phase}
                className={`rounded-lg border p-4 text-center transition-colors ${
                  item.status === 'current'
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border'
                }`}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Phase {item.phase}</p>
                <p className={`mt-1 text-sm font-medium ${item.status === 'current' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.title}
                </p>
                {item.status === 'current' && (
                  <span className="mt-2 inline-block text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
                    진행 중
                  </span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
