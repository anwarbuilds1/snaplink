import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Link2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function Register() {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsPending(true);
    try {
      await signup(data);
      toast.success("Successfully registered account!");
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errMsg = error.response?.data?.message ?? "Registration failed. Try again.";
      toast.error(errMsg);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Brand logo & header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-600 text-white p-2 rounded-xl items-center justify-center">
            <Link2 size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign up to start shortening and analyzing links</p>
        </div>

        {/* Register form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <Input
            id="register-name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            disabled={isPending}
            {...register("name")}
          />

          <Input
            id="register-email"
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            disabled={isPending}
            {...register("email")}
          />

          <div className="relative">
            <Input
              id="register-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              disabled={isPending}
              {...register("password")}
            />
            <button
              type="button"
              id="toggle-register-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            id="register-submit"
            className="w-full"
            isLoading={isPending}
            disabled={isPending}
          >
            Create Account
          </Button>
        </form>

        {/* Footer links */}
        <div className="text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-6">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
