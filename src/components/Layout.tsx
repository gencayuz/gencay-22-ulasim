
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold ml-2">Plaka Takip Sistemi</h1>
            </div>
            {/* Removed the duplicate Home button */}
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
