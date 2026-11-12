import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata = { title: "Admin · Sign in" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bench px-4 text-milk">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-milk/60">Michael Lapidary</p>
        <h1 className="display mt-3 text-4xl">The bench desk</h1>
        <p className="body-muted-dark mt-2 text-[14px]">Sign in to manage stones, orders and inquiries.</p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
