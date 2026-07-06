import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, User, Lock, ArrowLeft, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/services/auth.service";
import logo from "../../assets/logo.webp";
import illustration from "../../assets/ai_overview_illustration.png";
import { motion, AnimatePresence } from "framer-motion";

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
      setError(err instanceof Error ? err.message : "Invalid credentials");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields to continue.");
      return;
    }
    setError("");
    void loginMutation.mutateAsync({ email, password }).catch(() => undefined);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] p-4 sm:p-8 md:p-12 flex items-center justify-center font-sans relative overflow-hidden">
      {/* Absolute Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-[#0a0a0a]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px]" />
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -45, 0], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-teal-500/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full max-w-6xl bg-white/5 backdrop-blur-[40px] rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/10 overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[650px] lg:min-h-[750px]"
      >
        {/* Top Navigation Overlay */}
        <div className="absolute top-0 left-0 w-full px-6 py-6 md:px-10 flex justify-between items-center z-20">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
              <img src={logo} alt="TechVistar" className="h-8 w-8 rounded-lg object-cover" />
            </div>
            <span className="font-extrabold text-xl text-white font-display tracking-tight drop-shadow-md">TechVistar</span>
          </div>
          <Link to="/" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
            <ArrowLeft className="w-4 h-4" /> Return to Website
          </Link>
        </div>

        {/* Left Column: Premium Illustration */}
        <div className="w-full md:w-[45%] lg:w-1/2 p-8 pt-28 md:p-16 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-900/20 pointer-events-none" />
          
          <motion.div 
             animate={{ y: [0, -20, 0] }} 
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
             className="relative z-10 w-full max-w-[400px]"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full" />
            <img 
              src={illustration} 
              alt="Admin Portal" 
              className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(16,185,129,0.3)] filter brightness-110 contrast-125 relative z-10"
            />
          </motion.div>
          
          <div className="relative z-10 mt-12 text-center max-w-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3 h-3" /> Secure Gateway
            </div>
            <h3 className="text-xl font-bold text-white font-display mb-2 drop-shadow-md">Enterprise Portal</h3>
            <p className="text-sm font-medium text-slate-400">Advanced infrastructure management and analytics at your fingertips.</p>
          </div>
        </div>

        {/* Right Column: Deep Glassmorphism Form */}
        <div className="w-full md:w-[55%] lg:w-1/2 p-8 pt-12 md:p-16 flex flex-col justify-center bg-black/20 backdrop-blur-3xl relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="max-w-md w-full mx-auto relative z-10">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight mb-3 flex items-center gap-3">
                Sign In <Sparkles className="w-8 h-8 text-emerald-400 opacity-80" />
              </h1>
              <p className="text-slate-400 font-medium text-lg">Access your secure workspace</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div 
                className="space-y-5"
                animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <User className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-slate-500 group-focus-within:text-emerald-400'}`} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@techvistar.com"
                      autoComplete="email"
                      className={`pl-12 h-14 bg-white/5 border focus-visible:ring-2 rounded-2xl text-base shadow-inner transition-all text-white font-medium placeholder:text-slate-600 ${error ? 'border-red-500/50 focus-visible:ring-red-500/30' : 'border-white/10 hover:border-white/20 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50'}`}
                      value={email}
                      onChange={(event) => { setEmail(event.target.value); setError(""); }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                      <Lock className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : 'text-slate-500 group-focus-within:text-emerald-400'}`} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className={`pl-12 pr-12 h-14 bg-white/5 border focus-visible:ring-2 rounded-2xl text-base shadow-inner transition-all text-white font-medium placeholder:text-slate-600 ${error ? 'border-red-500/50 focus-visible:ring-red-500/30' : 'border-white/10 hover:border-white/20 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50'}`}
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setError(""); }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-emerald-400 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-400 cursor-pointer group">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                    className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 rounded border-slate-600 bg-white/5 w-5 h-5 group-hover:border-emerald-500/50 transition-colors"
                  />
                  <span className="group-hover:text-white transition-colors">Remember device</span>
                </label>

                <Link to="/admin/login" className="text-sm font-bold text-emerald-500 hover:text-emerald-400 hover:underline transition-all">
                  Recovery options
                </Link>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm font-bold text-red-200 bg-red-500/20 border border-red-500/30 p-3 rounded-xl text-center backdrop-blur-md">
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    type="submit" 
                    className="h-14 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-2xl text-lg font-black shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all w-full flex items-center justify-center gap-2"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Authorize Access"
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
