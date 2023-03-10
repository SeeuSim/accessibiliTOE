'use client'

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { createClient } from './supabase-browser';

import type { Database } from './types'

import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/auth-helpers-nextjs';
import { RealtimeChannel } from '@supabase/supabase-js';

type SupabaseContext = {
  supabase: SupabaseClient<Database>,
  session: Session | null,
  channel: RealtimeChannel | undefined,
  setChannel: Dispatch<SetStateAction<RealtimeChannel|undefined>>
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children, session }: { children: React.ReactNode, session: Session | null }) {
  const [supabase] = useState(() => createClient())
  const [channel, setChannel] = useState<RealtimeChannel>();
  return (
    <Context.Provider value={{ supabase, session, channel, setChannel }}>
      <>{children}</>
    </Context.Provider>
  )
}

export const useSupabase = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("Supabase must be used inside SupabaseProvider");
  } else {
    return context;
  }
}