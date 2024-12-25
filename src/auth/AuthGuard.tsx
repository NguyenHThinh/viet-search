"use client";
import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";
import { useAuthContext } from "./useAuthContext";
import Login from "@/app/[lng]/(auth)/login/login";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthContext();
  const { push, replace } = useRouter();
  const pathname = usePathname();
  const [requestedLocation, setRequestedLocation] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      push(requestedLocation);
    }
    if (isAuthenticated) {
      setRequestedLocation(null);
    }
  }, [isAuthenticated, pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    return <Login />;
  }

  return <>{children}</>;
}
