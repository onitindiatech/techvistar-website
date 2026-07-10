import { useState, type FormEvent, type MouseEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  Check,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "@/services/auth.service";
import logo from "../../assets/logo.webp";

import { motion, AnimatePresence } from "framer-motion";
import { AdminLoginVisual } from "./AdminLoginVisual";
import { PageSeo } from "@/components/common/PageSeo";
import { buildCanonical } from "@/lib/seoResolve";

const APP_VERSION = "v1.0.0";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await loginAdmin({ email, password });
      return result;
    },
    onSuccess: async (result) => {
      setIsSuccess(true);
      queryClient.setQueryData(["auth", "me"], result.admin);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 700);
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

  const handleRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  const isLoading = loginMutation.isPending;
  const isDisabled = isLoading || isSuccess;

  return (
    <>
      <PageSeo
        seo={{ robotsIndex: false, robotsFollow: false }}
        defaults={{
          title: 'Admin Login | TechVistar',
          description: 'Secure administrator sign-in for TechVistar CMS.',
          url: buildCanonical('/admin/login'),
        }}
      />
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-x-hidden bg-[#fafcfb] font-sans">
      {/* Page background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_60%)] lg:bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(20,184,166,0.06),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

      </div>

      <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col lg:flex-row">
        {/* Left panel — desktop split-screen only */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden shrink-0 overflow-hidden lg:block lg:min-h-screen lg:w-[55%]"
        >
          <AdminLoginVisual />
        </motion.div>

        {/* Right panel — login card */}
        <div className="flex min-h-screen min-h-[100dvh] flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-[45%] lg:min-h-screen lg:px-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full max-w-[420px]"
          >
            {/* Glass card */}
            <div className="rounded-[20px] border border-white/80 bg-white/80 p-6 shadow-[0_4px_24px_rgba(15,23,42,0.06),0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:rounded-[24px] sm:p-8 lg:p-10">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
              >
                {/* Logo */}
                <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 sm:mb-8">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm"
                  >
                    <img src={logo} alt="TechVistar" className="h-8 w-8 rounded-lg object-cover" />
                  </motion.div>
                  <div>
                    <p className="font-display text-lg font-bold tracking-tight text-slate-900">TechVistar</p>
                    <p className="text-xs font-medium text-emerald-600">Enterprise CMS</p>
                  </div>
                </motion.div>

                {/* Heading */}
                <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[2rem]">
                    Admin Portal
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-[15px]">
                    Sign in to manage content, analytics, and platform operations.
                  </p>
                </motion.div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  <motion.div variants={itemVariants} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email
                      </label>
                      <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                          <Mail
                            className={`h-[18px] w-[18px] transition-colors duration-200 ${
                              error ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-500"
                            }`}
                          />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@techvistar.com"
                          autoComplete="email"
                          className={`h-12 rounded-xl border bg-white/80 pl-11 text-base shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:ring-2 sm:text-[15px] ${
                            error
                              ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-500/20"
                              : "border-slate-200 hover:border-slate-300 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20"
                          }`}
                          value={email}
                          onChange={(event) => {
                            setEmail(event.target.value);
                            setError("");
                          }}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="text-sm font-medium text-slate-700">
                        Password
                      </label>
                      <div className="group relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                          <Lock
                            className={`h-[18px] w-[18px] transition-colors duration-200 ${
                              error ? "text-red-400" : "text-slate-400 group-focus-within:text-emerald-500"
                            }`}
                          />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className={`h-12 rounded-xl border bg-white/80 pl-11 pr-11 text-base shadow-sm transition-all duration-200 placeholder:text-slate-400 focus-visible:ring-2 sm:text-[15px] ${
                            error
                              ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-500/20"
                              : "border-slate-200 hover:border-slate-300 focus-visible:border-emerald-400 focus-visible:ring-emerald-500/20"
                          }`}
                          value={password}
                          onChange={(event) => {
                            setPassword(event.target.value);
                            setError("");
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute inset-y-0 right-0 z-10 flex items-center pr-4 text-slate-400 transition-colors hover:text-emerald-600"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-[18px] w-[18px]" />
                          ) : (
                            <Eye className="h-[18px] w-[18px]" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Remember / Forgot */}
                  <motion.div
                    variants={itemVariants}
                    className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                        className="h-4 w-4 rounded border-slate-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
                      />
                      Remember me
                    </label>
                    <Link
                      to="/admin/login"
                      className="text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 sm:text-right"
                    >
                      Forgot password
                    </Link>
                  </motion.div>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          animate={{ x: [-6, 6, -4, 4, 0] }}
                          transition={{ duration: 0.35 }}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600"
                        >
                          {error}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div variants={itemVariants} className="pt-2">
                    <motion.div whileHover={!isDisabled ? { y: -2 } : {}} whileTap={!isDisabled ? { scale: 0.99 } : {}}>
                      <Button
                        type="submit"
                        disabled={isDisabled}
                        onClick={handleRipple}
                        className={`relative h-12 w-full overflow-hidden rounded-xl border-0 text-[15px] font-semibold text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-shadow duration-300 ${
                          isSuccess
                            ? "bg-emerald-600"
                            : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-[0_6px_20px_rgba(16,185,129,0.45)]"
                        }`}
                      >
                        {ripples.map((ripple) => (
                          <motion.span
                            key={ripple.id}
                            className="pointer-events-none absolute rounded-full bg-white/30"
                            style={{ left: ripple.x, top: ripple.y }}
                            initial={{ width: 8, height: 8, marginLeft: -4, marginTop: -4, opacity: 0.5 }}
                            animate={{ width: 120, height: 120, marginLeft: -60, marginTop: -60, opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        ))}
                        <span className="relative flex items-center justify-center gap-2">
                          <AnimatePresence mode="wait">
                            {isSuccess ? (
                              <motion.span
                                key="success"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-2"
                              >
                                <Check className="h-5 w-5" />
                                Welcome back
                              </motion.span>
                            ) : isLoading ? (
                              <motion.span
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2"
                              >
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Signing in...
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                Sign in
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Footer */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 flex flex-col items-center gap-1 border-t border-slate-100 pt-5 text-center sm:mt-10 sm:pt-6"
                >
                  <p className="text-xs font-medium text-slate-400">{APP_VERSION}</p>
                  <p className="text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} TechVistar. All rights reserved.
                  </p>
                </motion.div>
              </motion.div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
