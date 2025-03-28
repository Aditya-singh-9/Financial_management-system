import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  BarChart, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Users,
  FileText,
  AlertTriangle,
  PieChart,
  BrainCircuit,
  DollarSign,
  GraduationCap,
  Bell,
  BookOpen
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AppSidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Define menu items based on user role
  const menuItems = user?.role === 'admin' 
    ? [
        { title: 'Dashboard', path: '/dashboard', icon: Home },
        { title: 'Analytics', path: '/analytics', icon: BarChart },
        { title: 'Students', path: '/students', icon: Users },
        { title: 'Teachers', path: '/teachers', icon: GraduationCap },
        { title: 'Salary', path: '/salary', icon: DollarSign },
        { title: 'Reports', path: '/reports', icon: FileText },
        { title: 'Fraud Alerts', path: '/fraud-detection', icon: AlertTriangle },
        { title: 'Settings', path: '/settings', icon: Settings },
      ]
    : [
        { title: 'Dashboard', path: '/dashboard', icon: Home },
        { title: 'Announcements', path: '/announcements', icon: Bell },
        { title: 'Payments', path: '/payments', icon: CreditCard },
        { title: 'Profile', path: '/profile', icon: User },
        { title: 'Settings', path: '/settings', icon: Settings },
      ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center px-4">
          <div className="h-10 w-10 rounded-full bg-edu-purple-400 flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">EF</span>
          </div>
          <span className="font-bold text-lg">EduFinFlare</span>
        </div>
        <SidebarTrigger className="absolute top-7 right-2">
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", {
            "rotate-180": location.pathname !== "/"
          })} />
        </SidebarTrigger>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto mb-4">
          <SidebarGroupContent className="px-4 py-2">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleTheme}
                className="justify-start"
              >
                {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </Button>
              
              <div className="flex items-center p-2 rounded-lg">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-edu-purple-300">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={logout}
                className="justify-start text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
