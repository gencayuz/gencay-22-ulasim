
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ThemeToggle } from "./ThemeToggle";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable F12 key and Ctrl+Shift+I
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" || 
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i"))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full theme-transition" onCopy={(e) => e.preventDefault()}>
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6 theme-transition">
          <div className="flex items-center justify-between mb-6 p-2 bg-primary/5 rounded-lg shadow-sm">
            <div className="flex items-center">
              <SidebarTrigger className="text-primary hover:bg-primary/10 rounded-md" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-primary">Keşan Belediyesi</h1>
                <p className="text-sm text-muted-foreground">Ulaşım Hizmetleri Yönetim Sistemi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
          <div className="theme-transition">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
