// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MdDashboard, MdAutoGraph, MdMenu } from "react-icons/md";
import { SiGoogleanalytics } from "react-icons/si";
import { FaBell } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import { VscLayoutSidebarLeft, VscLayoutSidebarRight } from "react-icons/vsc";
import type { IconType } from 'react-icons';

interface SidebarItemProps {
  to: string;
  icon: IconType;          // <- pass the component, not an element
  label: string;
  isCollapsed: boolean;
  size?: number;           // optional per-item override
}

const SidebarItem = ({ to, icon: Icon, label, isCollapsed, size }: SidebarItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  // Default sizes (bigger when collapsed)
  const baseSize = isCollapsed ? 40 : 35;
  const iconSize = size ?? baseSize;

  return (
    <Link to={to}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start mb-4 ${isCollapsed ? 'px-5' : 'px-4'} transition-all duration-300`}
      >
        <div className="flex items-center gap-3">
          {/* Explicit size + color */}
          <Icon className="shrink-0 text-[#113B38]" size={iconSize} />
          {!isCollapsed && <span className="truncate">{label}</span>}
        </div>
      </Button>
    </Link>
  );
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <>
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <div
        className="hidden md:flex h-screen shrink-0 flex-col justify-between border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 transition-[width] duration-300"
        style={{ width: collapsed ? '80px' : '250px' }}
      >
        {/* Top: Header + Nav */}
        <div className="flex flex-col">
          <div className={`flex p-4 ${collapsed ? 'justify-center' : 'justify-between'} items-center mb-4`}>
            {!collapsed && <h2 className="text-xl font-bold">Clisma</h2>}
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
              {collapsed ? <VscLayoutSidebarRight size={20}/> : <VscLayoutSidebarLeft size={20}/>}
            </Button>
          </div>

          <nav className="px-2">
            <SidebarItem to="/dashboard"           icon={MdDashboard}      label="Dashboard"        isCollapsed={collapsed} />
            <SidebarItem to="/monitoring"          icon={MdAutoGraph}      label="Real Monitoring"  isCollapsed={collapsed} />
            <SidebarItem to="/dashboard/analytics" icon={SiGoogleanalytics} label="Analytics"        isCollapsed={collapsed} />
            <SidebarItem to="/dashboard/alerts"    icon={FaBell}           label="Alerts"           isCollapsed={collapsed} />
            <SidebarItem to="/dashboard/reports"   icon={TbReport}         label="Reports"          isCollapsed={collapsed} />
          </nav>
        </div>

        {/* Bottom: Settings */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <SidebarItem to="/dashboard/settings" icon={IoSettingsSharp} label="Settings" isCollapsed={collapsed} />
        </div>
      </div>

      {/* ==================== MOBILE SIDEBAR (Sheet) ==================== */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <MdMenu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            <div className="flex h-full flex-col justify-between py-4">
              <div>
                <h2 className="mb-6 px-4 text-xl font-bold">Clisma</h2>
                <nav className="space-y-1 px-2">
                  <SidebarItem to="/dashboard" icon={MdDashboard} label="Dashboard" isCollapsed={false} size={26} />
                  {/* ...Other items (add size={26} if you want explicit mobile size) */}
                </nav>
              </div>
              <div className="px-2 border-t pt-4 mt-4">
                <SidebarItem to="/dashboard/settings" icon={IoSettingsSharp} label="Settings" isCollapsed={false} size={26} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}