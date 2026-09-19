import { z } from "zod";
import { readJSON, textResult } from "../utils.js";

export const name = "search_by_skill";

export const config = {
  title: "Search By Skill",
  description:
    "Recherche transversale par mot-clé (technologie, outil, compétence) à travers les expériences, " +
    "les projets ET les catégories de compétences de Maryem Bannour. Utile pour répondre à des questions " +
    "comme 'où Maryem a-t-elle utilisé X ?' en croisant toutes les sources en une seule requête.",
  inputSchema: {
    keyword: z
      .string()
      .describe(
        "Mot-clé à rechercher (ex: 'React', 'RAG', 'Docker'). Recherche insensible à la casse, correspondance partielle.",
      ),
  },
};

export async function handler({ keyword }) {
  const [experiences, projects, skills] = await Promise.all([
    readJSON("experiences.json"),
    readJSON("projects.json"),
    readJSON("skills.json"),
  ]);

  const kw = keyword.toLowerCase();
  const matches = (text) => text.toLowerCase().includes(kw);

  const matchingExperiences = experiences.filter(
    (exp) =>
      exp.technologies.some((t) => matches(t)) ||
      exp.highlights.some((h) => matches(h)),
  );

  const matchingProjects = projects.filter(
    (p) => p.technologies.some((t) => matches(t)) || matches(p.description),
  );

  const matchingSkills = Object.fromEntries(
    Object.entries(skills)
      .map(([category, items]) => [
        category,
        items.filter((item) => matches(item) || matches(category)),
      ])
      .filter(([, items]) => items.length > 0),
  );

  const totalMatches =
    matchingExperiences.length +
    matchingProjects.length +
    Object.keys(matchingSkills).length;

  if (totalMatches === 0) {
    return textResult({
      message: `Aucun résultat trouvé pour "${keyword}".`,
    });
  }

  return textResult({
    keyword,
    experiences: matchingExperiences,
    projects: matchingProjects,
    skills: matchingSkills,
  });
}
