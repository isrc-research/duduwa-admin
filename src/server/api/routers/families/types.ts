import { family } from "@/server/db/schema";
import { duduwaAnimalProduct } from "@/server/db/schema/family/animal-products";
import { duduwaAnimal } from "@/server/db/schema/family/animals";
import { duduwaCrop } from "@/server/db/schema/family/crops";
import duduwaAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { duduwaIndividual } from "@/server/db/schema/family/individual";

export type FamilyResult = typeof family.$inferSelect & {
  agriculturalLands: (typeof duduwaAgriculturalLand.$inferSelect)[];
  animals: (typeof duduwaAnimal.$inferSelect)[];
  animalProducts: (typeof duduwaAnimalProduct.$inferSelect)[];
  crops: (typeof duduwaCrop.$inferSelect)[];
  individuals: (typeof duduwaIndividual.$inferSelect)[];
};
