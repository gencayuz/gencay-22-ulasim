
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { FileText, ClipboardList, FileCheck, BarChart3, FileBarChart, Home, Archive } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const sidebarItems = [
  {
    title: "Ana Sayfa",
    path: "/",
    icon: Home,
  },
  {
    title: "M Plaka",
    path: "/m-plaka",
    icon: FileText,
  },
  {
    title: "S Plaka",
    path: "/s-plaka",
    icon: ClipboardList,
  },
  {
    title: "T Plaka",
    path: "/j-plaka",
    icon: FileCheck,
  },
  {
    title: "D4 Plaka",
    path: "/d4-plaka",
    icon: FileBarChart,
  },
  {
    title: "D4S Plaka",
    path: "/d4s-plaka",
    icon: FileBarChart,
  },
  {
    title: "Arşiv",
    path: "/arsiv",
    icon: Archive,
  },
  {
    title: "Raporlar",
    path: "/raporlar",
    icon: BarChart3,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 mb-4">
          <h1 className="text-xl font-bold">Plaka Takip</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Kategoriler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full ${
                      location.pathname === item.path
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : ""
                    }`}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
