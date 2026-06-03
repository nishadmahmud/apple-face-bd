"use client";

import LoadingSpinner from "../components/Shared/LoadingSpinner";

export default function GlobalLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-card-bg">
      <LoadingSpinner size="lg" label="Loading" showBrand />
    </div>
  );
}
