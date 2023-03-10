'use client'
import { useSupabase } from "app/(components)/utils/supabase-provider";
import { useRouter } from "next/navigation";

export default function JoinSession() {
  const { supabase, session } = useSupabase();
  const router = useRouter();

  if (!session) return router.push("/login");

  return (
    <>
      Game Page
    </>
  );
}