import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { HardHat, Menu } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  headerActions?: ReactNode;
}

export function AppLayout({ children, title, headerActions }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="h-10 w-10 shrink-0">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            <div className="flex items-center gap-3 md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <HardHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">EGM</span>
            </div>

            {title && (
              <h1 className="hidden md:block text-heading font-semibold text-foreground">
                {title}
              </h1>
            )}

            {headerActions && <div className="ml-auto">{headerActions}</div>}
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="px-4 py-6 pb-24 md:pb-6 max-w-full">
              {title && (
                <h1 className="md:hidden text-heading font-semibold text-foreground mb-6">
                  {title}
                </h1>
              )}
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
