import { useLocation, Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  FolderKanban,
  PlusCircle,
  LayoutList,
  Settings,
  HardHat,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Proyectos", url: "/proyectos", icon: FolderKanban },
  { title: "Nueva obra", url: "/nueva-obra", icon: PlusCircle },
  { title: "Partidas", url: "/partidas", icon: LayoutList },
  { title: "Ajustes", url: "/ajustes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <HardHat className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-body-lg font-bold text-sidebar-foreground">
                EGM
              </span>
              <span className="text-small text-sidebar-foreground/70">
                Presupuestos
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-12 px-3"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 rounded-lg transition-colors"
                        activeClassName="bg-sidebar-primary text-sidebar-primary-foreground"
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && (
                          <span className="text-body font-medium">
                            {item.title}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}