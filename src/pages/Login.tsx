
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple login check - in a real app, you'd validate against a server
    setTimeout(() => {
      if (username && password) {
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        
        // Navigate to dashboard
        navigate("/");
        toast.success("Giriş başarılı");
      } else {
        toast.error("Lütfen kullanıcı adı ve şifre giriniz");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center theme-transition bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="mb-6">
            {/* You can add a logo here */}
            <div className="w-24 h-24 mx-auto bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">KB</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-primary">Keşan Belediyesi</h1>
          <h2 className="text-xl text-foreground">Ulaşım Hizmetleri</h2>
        </div>

        <Card className="border border-border shadow-lg theme-transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Giriş Yap</CardTitle>
            <CardDescription>
              Sisteme giriş yapmak için bilgilerinizi giriniz
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Kullanıcı Adı
                </label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınızı giriniz"
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Şifre
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  className="border-input"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white" 
                disabled={loading}
              >
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
