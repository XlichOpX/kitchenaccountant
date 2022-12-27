import { PrismaClient } from "@prisma/client";
import { INGREDIENTS, MEASUREMENT_UNITS } from "./mock-data";

const prisma = new PrismaClient();
const timerLabel = "Tiempo de ejecución";

async function main() {
  console.time(timerLabel);

  console.log("🧽 Limpiando BD...");
  await prisma.ingredient.deleteMany();
  await prisma.measurementUnit.deleteMany();

  console.log("📏 Recreando unidades de medida...");
  for (const data of MEASUREMENT_UNITS) {
    await prisma.measurementUnit.create({ data });
  }

  console.log("🌾 Recreando ingredientes...");
  for (const data of INGREDIENTS) {
    await prisma.ingredient.create({ data });
  }

  console.timeEnd(timerLabel);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
