import 'server-only';
import NavBar from './(components)/ui/nav';

import SupabaseListener from './(components)/utils/supabase-listener';
import SupabaseProvider from './(components)/utils/supabase-provider';
import { createClient } from './(components)/utils/supabase-server';
import { TRPCProvider } from 'providers/trpcProvider';

import './globals.css'

// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head />
      <body>
        <TRPCProvider>
          <SupabaseProvider session={session}>
            <SupabaseListener serverAccessToken={session?.access_token} />
            <NavBar session={session}/>
            {children}
          </SupabaseProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
