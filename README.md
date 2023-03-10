# Accessibili-TOE

Ever wanted to play games in your browser, but find them too complicated or
hard to use with an accessibility-device (i.e. screenreader)?

Accessibili-TOE is for you!

It is a simple Tic-Tac-Toe game that:

- is Easy to use with screen readers
- allows you to play others 1v1 with **session ID**
- remembers your past games

Give it a try!

@Author [SeeuSim](https://github.com/SeeuSim)

## User Flows
  
  - `/` -> `/login`: "Start Match"
    
    Only authorised users may start matches. Hence, a login step is required.

  - `/login` <-> `/signup`
     
    Users may create accounts, or log in to existing ones easily. Big UI fields and buttons make it easy to use with screen readers.

  - `/login` -> `/joinSession`
    
    Join games, or create them. As of now, the message subscribing is a little buggy, hence a little more waiting is needed for the logic to flow. 
    Nevertheless, upon `creation` of a room, it should set the creator as Player 1 "X" and the one who joins as Player 2 "O".

    Users can create rooms, and join rooms with the ID. For now, the QR Code feature is still buggy as the absolute link has not been added.

  - `/joinSession/$id` -> `/game/$id?player=$player_num`

    Upon another user successfully joining, a game is created and the game starts. As the server infrastructure is not meant for heavy use, the polling rate is low and may take some time to load. Loading animations are planned for this.
  
  - `/game/$id?player=$player_num`
    
    Upon game start, the two players take turns. The one who started the session goes first as "X". while the other goes as "O".
    As the data states for the players' turns are a little buggy, no text UI has been catered for this yet.

  - `/user`
    
    All moves made by the user are stored in the database. However, the user profile only lists the attempted games, and upon clicking of those,
    navigates back to the final game state.

    Nevertheless, all past games are displayed as links.

- Navbar

  The app icon is large, and acts as a "Home" button. It also uses large, contrasting buttons for login, sign up, profile, and log out.
  This makes it easier to see, and use with screen readers.

  The general UI of the app also resizes on window resize, and can be played on both mobile, tablet and desktop.


## Infrastructure

This app uses NextJS 13, with TypeScript and with the following technologies:

- Supabase (Database, Auth)
- TRPC (data hooks) with TanStack Query
  - Zod for type validation
- Prisma (SQL ORM)
- Tailwind CSS for the UI
- Vercel for Deployment

## Setup Guide

Follow these steps to set your project up.

1. Clone this repository.
2. You will need a Supabase Account to work with this project. Set it up first.
3. In the root directory, populate your `.env` with the following:

```text
DATABASE_URL="postgres://postgres:[Password]@[database_url]:[database_port]/postgres?schema=public&pgbouncer=true"

NEXT_PUBLIC_SUPABASE_URL=[Supabase URL]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[Supabase Anon Key]
```

4. Run the `install` command with `yarn`, `npm`, or `pnpm`, to install all dependencies.

```shell
npm install

##OR
yarn install

##OR
pnpm install
```

5. Run Tailwind Setup:

```shell
pnpm install -D tailwindcss
pnpm tailwindcss init
```

6. Run Prisma Setup:

```shell
pnpm prisma db push
pnpm prisma generate
```

7. Run Supabase CLI Setup, with the Project ID specified under your Supabase Project.

```shell
supabase init
supabase login
supabase --link --project-ref $ProjectID
```

8. Run the app:

```shell
pnpm dev
```

## Development Guide

Here are a few conventions:

- Server vs Client Side
  
  This uses NextJS 13, which is based off React Server Components. However, many libraries that rely on React Hooks need client rendered interactivity. Hence, use `'use client'` at the top of those components

- TRPC data fetching
  
  TRPC endpoints can be created under `src/server/routers`. These are typed functions that use Zod type validation and process the requests
  on the backend around a Tanstack Query function. You may refer to the TRPC docs on how to invoke them from the frontend, but it functions
  similarly to an RPC.

- Basic NextJS 13 fetching
  
  API Endpoints are done for the following:
  
  - `/api/game/create` (Replaced by TRPC)
  - `/api/game/join` (Replaced by TRPC)
  - `/api/auth/signup` (For creation of DB models, actual auth is done by Supabase)
    
    This only posts the user's email and password in a JSON string, hence POSTMAN requests should be formatted as such.

  As React Server and Client components complicate data fetching with unstandardized use of `asnyc`, it is recommended to use TRPC endpoints instead.

- UI Components for the Board
  
  Can be found under `src/app/(components)/ui`.

  All pages can be found under `src/app`. This follows the NextJS 13 file routing conventions.


