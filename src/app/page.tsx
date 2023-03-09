import { createClient } from "./(components)/utils/supabase-server";

export default async function Home() {
  const supabase = createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  return (
    <div className="font-bold text-blue-800">
      <div>
      Welcome to Accessibili-TOE
      <br/>
      Start a Game
      <br/>
      Join a Game
      </div>
      
    </div>
  )
}
