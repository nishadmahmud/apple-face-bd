"use client";

import { Suspense } from "react";
import AuthForm from "../../components/Auth/AuthForm";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100dvh-8rem)] flex items-center justify-center px-4 py-10 md:py-14 bg-card-bg">
      <Suspense
        fallback={
          <div className="py-16">
            <LoadingSpinner size="lg" label="Loading…" />
          </div>
        }
      >
        <AuthForm />
      </Suspense>
    </div>
  );
}
