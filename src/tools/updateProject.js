import { z } from "zod";
import { readJSON, writeJSON, textResult } from "../utils.js";

export const name = "update_project";

export const config = {
  title: "Update Project",
  description:
    "Met à jour un projet existant (identifié par son id, voir list_projects) : " +
    "modifie uniquement les champs fournis, laisse les autres inchangés.",
  inputSchema: {
    id: z
      .string()
      .describe(
        "Identifiant du projet à modifier (voir list_projects pour la liste des id)",
      ),
    name: z.string().optional().describe("Nouveau nom (optionnel)"),
    description: z
      .string()
      .optional()
      .describe("Nouvelle description (optionnel)"),
    technologies: z
      .array(z.string())
      .optional()
      .describe(
        "Nouvelle liste de technologies (optionnel, remplace l'ancienne)",
      ),
    date: z.string().optional().describe("Nouvelle date/période (optionnel)"),
  },
};

export async function handler({ id, name, description, technologies, date }) {
  const projects = await readJSON("projects.json");
  const index = projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return textResult({
      error: `Aucun projet trouvé avec l'id "${id}".`,
      idsDisponibles: projects.map((p) => p.id),
    });
  }

  const updated = {
    ...projects[index],
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(technologies !== undefined && { technologies }),
    ...(date !== undefined && { date }),
  };
  projects[index] = updated;
  await writeJSON("projects.json", projects);

  return textResult({
    message: "Projet mis à jour avec succès.",
    project: updated,
  });
}
