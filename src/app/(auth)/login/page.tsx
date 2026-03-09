import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner size="lg" label="Loading..." />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
