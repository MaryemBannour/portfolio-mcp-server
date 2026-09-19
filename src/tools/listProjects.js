import { z } from "zod";
import { readJSON, textResult } from "../utils.js";

export const name = "list_projects";

export const config = {
  title: "List Projects",
  description:
    "Retourne les projets personnels de Maryem Bannour. " +
    "Peut être filtré par technologie exacte (ex: 'React.js') pour ne retourner que les projets qui l'utilisent.",
  inputSchema: {
    technology: z
      .string()
      .optional()
      .describe(
        "Technologie à filtrer (recherche exacte dans la liste des technologies du projet).",
      ),
  },
};

export async function handler({ technology }) {
  const projects = await readJSON("projects.json");
  if (!technology) return textResult(projects);

  const filtered = projects.filter((p) =>
    p.technologies.some((t) => t.toLowerCase() === technology.toLowerCase()),
  );
  if (filtered.length === 0) {
    return textResult({
      message: `Aucun projet trouvé utilisant "${technology}".`,
    });
  }
  return textResult(filtered);
}
