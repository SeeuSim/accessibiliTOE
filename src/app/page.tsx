import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";


export default async function Home() {
  const user = await getServerSession(authOptions);
  return (
    <main className="font-bold text-blue-800">
      Welcome to Accessibili-TOE
      
      Start a Game
    </main>
  )
}
