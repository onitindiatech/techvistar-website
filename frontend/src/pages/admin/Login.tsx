import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAdmin } from "@/services/auth.service";
import logo from "../../assets/logo.webp";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await loginAdmin({ email, password });
      return result;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/admin/dashboard", { replace: true });
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : "Login failed");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    void loginMutation.mutateAsync({ email, password }).catch(() => undefined);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="TechVistar"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/10"
            />
            <div>
              <p className="text-xl font-extrabold font-display tracking-tight text-slate-900">
                TechVistar
              </p>
              <p className="text-sm text-slate-500">Admin Portal</p>
            </div>
          </div>

          <div className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-slate-900">Admin Portal</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Authorized personnel only
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@techvistar.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="pr-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <span>Remember me</span>
              </label>

              <Link to="/admin/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Forgot password?
              </Link>
            </div>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
