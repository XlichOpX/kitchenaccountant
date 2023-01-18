# KitchenAccountant

Una aplicación sencilla que permite el manejo de ingredientes, recetas y calcular sus costos. Permite utilizar recetas dentro de otras, facilitando así la organización de las mismas.

## Herramientas utilizadas

- Create T3 App
- Prisma ORM
- tRPC
- Tailwind CSS
- Radix UI
- NextAuth.js
- Zod

## ¿Cómo ejecutar este proyecto?

Una vez clonado el repositorio, crear un archivo `.env` basado en `.env.example` y escribir las variables de entorno necesarias.

Seguidamente, abrir una terminal en el directorio del proyecto y ejecutar los siguientes comandos:

- `pnpm install`
- `pnpm prisma migrate dev`
- `pnpm prisma db seed`
- `pnpm dev`

La aplicación será accesible desde `http://localhost:3000`
