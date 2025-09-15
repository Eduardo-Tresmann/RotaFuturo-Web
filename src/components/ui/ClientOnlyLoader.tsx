"use client";
import { LoaderRF } from "@/components/ui/LoaderRF";
import { useAuthContext } from "@/components/context/AuthContext";

export default function ClientOnlyLoader() {
  const { authResolved } = useAuthContext();
  if (!authResolved) return <LoaderRF />;
  return null;
}
