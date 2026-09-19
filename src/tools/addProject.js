import { z } from "zod";
import { readJSON, writeJSON, textResult } from "../utils.js";

export const name = "add_project";

export const config = {
  title: "Add Project",
  description:
    "Ajoute un nouveau projet personnel aux données de Maryem Bannour (modifie data/projects.json). " +
    "Utile pour tenir son profil à jour directement depuis un client MCP comme Claude Desktop.",
  inputSchema: {
    name: z.string().describe("Nom du projet"),
    description: z.string().describe("Description courte du projet"),
    technologies: z
      .array(z.string())
      .describe("Liste des technologies utilisées"),
    date: z
      .string()
      .describe("Date ou période du projet (ex: '2026' ou 'Jan 2026')"),
  },
};

export async function handler({ name, description, technologies, date }) {
  const projects = await readJSON("projects.json");

  const id = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (projects.some((p) => p.id === id)) {
    return textResult({ error: `Un projet avec l'id "${id}" existe déjà.` });
  }

  const newProject = { id, name, description, technologies, date };
  projects.push(newProject);
  await writeJSON("projects.json", projects);

  return textResult({
    message: "Projet ajouté avec succès.",
    project: newProject,
  });
}
