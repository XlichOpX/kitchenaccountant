![KitchenAccountant logo](/public/color-logo.svg)

# KitchenAccountant

A simple web app that lets you create recipes with ingredients and calculates their cost.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It was made using:

- [Supabase](https://supabase.com/)
- [Ant Design](https://ant.design/)
- [SWR](https://swr.vercel.app/)

## Getting Started

Setup a supabase project with the following database structure:

![Entity-Relationship Diagram](/docs/erd.jpg)

Make sure to create the respective RLS policies for each table so you can interact with the database.

Get your supabase project API URL and ANON KEY from the API settings panel. Then, populate your .env.local file as follows:

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE PROJECT ANON KEY>
NEXT_PUBLIC_SUPABASE_URL=<SUPABASE PROJECT API URL>
NEXT_PUBLIC_APP_NAME=<APP NAME>
```

Now, you can run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Deployed on Vercel

https://kitchenaccountant.vercel.app/
