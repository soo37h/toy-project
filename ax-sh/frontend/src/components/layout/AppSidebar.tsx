import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  LogIn,
  LogOut,
  User,
  ChevronRight,
} from 'lucide-react';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: '커뮤니티',
    items: [
      { title: '게시판', path: '/boards', icon: FileText },
    ],
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Logo */}
      <SidebarHeader className="px-4 pt-6 pb-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white text-sm font-bold">
            AX
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">ax-toy</span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
              {group.label}
            </p>
            <SidebarGroupContent>
              <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        flex items-center gap-3 rounded px-3 py-2.5 text-[14px] font-medium transition-colors
                        ${active
                          ? 'bg-[rgba(167,139,250,0.5)] text-white'
                          : 'text-white/80 hover:bg-white/[0.06] hover:text-white'
                        }
                      `}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0 opacity-90" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 pb-2 mt-auto space-y-1">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex w-full items-center gap-2.5 rounded px-3 py-2.5 transition-colors hover:bg-white/[0.06]">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-red-500 text-white text-[10px] font-bold">
                    {user.nickname.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[13px] text-white/90 font-medium">{user.nickname}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/30" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">{user.nickname}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <User className="h-4 w-4" />
                내 정보
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-3 rounded px-3 py-2.5 text-[14px] font-medium text-white/80 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <LogIn className="h-[18px] w-[18px] shrink-0 opacity-90" />
            <span>로그인</span>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
