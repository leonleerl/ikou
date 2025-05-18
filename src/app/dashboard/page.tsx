"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from "@radix-ui/themes";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // 只在认证状态改变且已认证时进行重定向
    if (status === "authenticated" && session?.user?.id) {
      router.push(`/dashboard/${session.user.id}`);
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spinner size="3" className="mb-4" />
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-6 shadow-md text-center max-w-md">
          <h2 className="text-xl font-bold text-amber-800 mb-2">Unauthorised</h2>
          <p className="text-amber-700 mb-4">Please login to access your dashboard</p>
          <button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium px-5 py-2 rounded transition-all duration-300 hover:shadow-md"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // 显示加载页面，等待重定向
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner size="3" className="mb-4" />
      <p className="text-lg text-gray-600">Redirecting to your dashboard...</p>
    </div>
  );
}
