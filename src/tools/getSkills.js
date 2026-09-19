import { z } from "zod";
import { readJSON, textResult } from "../utils.js";

export const name = "get_skills";

export const config = {
  title: "Get Skills",
  description:
    "Retourne les compétences techniques de Maryem Bannour, organisées par catégorie " +
    "(Programmation, Intelligence artificielle, Backend, Bases de données, Web & Cloud, Mobile, Méthodologie). " +
    "Peut être filtré par catégorie exacte.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe(
        "Catégorie à filtrer (ex: 'Intelligence artificielle'). Omettre pour tout retourner.",
      ),
  },
};

export async function handler({ category }) {
  const skills = await readJSON("skills.json");
  if (!category) return textResult(skills);

  const match = Object.keys(skills).find(
    (k) => k.toLowerCase() === category.toLowerCase(),
  );
  if (!match) {
    return textResult({
      message: `Catégorie "${category}" introuvable.`,
      categoriesDisponibles: Object.keys(skills),
    });
  }
  return textResult({ [match]: skills[match] });
}
