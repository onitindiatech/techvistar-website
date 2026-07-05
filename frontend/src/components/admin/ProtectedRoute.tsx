import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCurrentAdmin } from "@/services/auth.service";

const ProtectedRoute = () => {
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentAdmin,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm font-medium text-slate-600">Checking authentication…</div>
      </div>
    );
  }

  if (isError || !data) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
