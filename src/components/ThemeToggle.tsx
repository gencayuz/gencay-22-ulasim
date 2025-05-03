import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // Initialize with system preference or stored preference
  const [isDark, setIsDark] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Check local storage first
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme === "dark";
      }
      
      // Otherwise check system preference
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setIsDark(!isDark)}
      className="rounded-full bg-background/10 hover:bg-background/20 animate-fade-in"
      title={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-300 transition-transform" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-transform" /> 
      )}
      <span className="sr-only">Tema Değiştir</span>
    </Button>
  );
}
