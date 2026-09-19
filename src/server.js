import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");

async function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const content = await fs.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

async function writeJSON(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function textResult(data) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

const server = new McpServer({
  name: "portfolio-mcp-server",
  version: "1.0.0",
});

// --- Tool 1 : get_experiences ---
server.registerTool(
  "get_experiences",
  {
    title: "Get Experiences",
    description:
      "Retourne les expériences professionnelles de Maryem Bannour, avec leurs dates, technologies et missions. " +
      "Peut être filtré par entreprise (recherche exacte, insensible à la casse).",
    inputSchema: {
      company: z.string().optional().describe("Nom de l'entreprise pour filtrer (ex: 'Clevertech France'). Omettre pour tout retourner."),
    },
  },
  async ({ company }) => {
    const experiences = await readJSON("experiences.json");
    if (!company) return textResult(experiences);

    const filtered = experiences.filter(
      (exp) => exp.company.toLowerCase() === company.toLowerCase()
    );
    if (filtered.length === 0) {
      return textResult({ message: `Aucune expérience trouvée pour l'entreprise "${company}".` });
    }
    return textResult(filtered);
  }
);

// --- Tool 2 : list_projects ---
server.registerTool(
  "list_projects",
  {
    title: "List Projects",
    description:
      "Retourne les projets personnels de Maryem Bannour. " +
      "Peut être filtré par technologie exacte (ex: 'React.js') pour ne retourner que les projets qui l'utilisent.",
    inputSchema: {
      technology: z.string().optional().describe("Technologie à filtrer (recherche exacte dans la liste des technologies du projet)."),
    },
  },
  async ({ technology }) => {
    const projects = await readJSON("projects.json");
    if (!technology) return textResult(projects);

    const filtered = projects.filter((p) =>
      p.technologies.some((t) => t.toLowerCase() === technology.toLowerCase())
    );
    if (filtered.length === 0) {
      return textResult({ message: `Aucun projet trouvé utilisant "${technology}".` });
    }
    return textResult(filtered);
  }
);

// --- Tool 3 : get_skills ---
server.registerTool(
  "get_skills",
  {
    title: "Get Skills",
    description:
      "Retourne les compétences techniques de Maryem Bannour, organisées par catégorie " +
      "(Programmation, Intelligence artificielle, Backend, Bases de données, Web & Cloud, Mobile, Méthodologie). " +
      "Peut être filtré par catégorie exacte.",
    inputSchema: {
      category: z.string().optional().describe("Catégorie à filtrer (ex: 'Intelligence artificielle'). Omettre pour tout retourner."),
    },
  },
  async ({ category }) => {
    const skills = await readJSON("skills.json");
    if (!category) return textResult(skills);

    const match = Object.keys(skills).find(
      (k) => k.toLowerCase() === category.toLowerCase()
    );
    if (!match) {
      return textResult({
        message: `Catégorie "${category}" introuvable.`,
        categoriesDisponibles: Object.keys(skills),
      });
    }
    return textResult({ [match]: skills[match] });
  }
);

// --- Tool 4 : add_project (écriture) ---
server.registerTool(
  "add_project",
  {
    title: "Add Project",
    description:
      "Ajoute un nouveau projet personnel aux données de Maryem Bannour (modifie data/projects.json). " +
      "Utile pour tenir son profil à jour directement depuis un client MCP comme Claude Desktop.",
    inputSchema: {
      name: z.string().describe("Nom du projet"),
      description: z.string().describe("Description courte du projet"),
      technologies: z.array(z.string()).describe("Liste des technologies utilisées"),
      date: z.string().describe("Date ou période du projet (ex: '2026' ou 'Jan 2026')"),
    },
  },
  async ({ name, description, technologies, date }) => {
    const projects = await readJSON("projects.json");

    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // retire les accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (projects.some((p) => p.id === id)) {
      return textResult({ error: `Un projet avec l'id "${id}" existe déjà.` });
    }

    const newProject = { id, name, description, technologies, date };
    projects.push(newProject);
    await writeJSON("projects.json", projects);

    return textResult({ message: "Projet ajouté avec succès.", project: newProject });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Portfolio MCP server lancé (stdio).");
}

main().catch((err) => {
  console.error("Erreur fatale :", err);
  process.exit(1);
});
