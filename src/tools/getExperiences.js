import { z } from "zod";
import { readJSON, textResult } from "../utils.js";

export const name = "get_experiences";

export const config = {
  title: "Get Experiences",
  description:
    "Retourne les expériences professionnelles de Maryem Bannour, avec leurs dates, technologies et missions. " +
    "Peut être filtré par entreprise (recherche exacte, insensible à la casse).",
  inputSchema: {
    company: z
      .string()
      .optional()
      .describe(
        "Nom de l'entreprise pour filtrer (ex: 'Clevertech France'). Omettre pour tout retourner.",
      ),
  },
};

export async function handler({ company }) {
  const experiences = await readJSON("experiences.json");
  if (!company) return textResult(experiences);

  const filtered = experiences.filter(
    (exp) => exp.company.toLowerCase() === company.toLowerCase(),
  );
  if (filtered.length === 0) {
    return textResult({
      message: `Aucune expérience trouvée pour l'entreprise "${company}".`,
    });
  }
  return textResult(filtered);
}
