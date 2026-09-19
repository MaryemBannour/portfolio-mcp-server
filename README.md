# Portfolio MCP Server

Serveur [Model Context Protocol](https://modelcontextprotocol.io) exposant mon profil professionnel (expériences, projets, compétences) comme des outils interrogeables par n'importe quel client MCP — Claude Desktop, Claude Code, ou toute autre application compatible.

## Pourquoi ce projet
## Démo

**Lecture ciblée — `get_experiences` :**

*"Quelles technologies exactes Maryem a-t-elle utilisées pendant son stage chez Mobelite Tunisie ?"*

![Lecture d'une expérience](screenshots/demo-1-get-experiences.png)

**Recherche transversale — `search_by_skill` :**

*"Où Maryem a-t-elle utilisé GPT-5-nano dans son parcours ?"*

![Recherche transversale](screenshots/demo-2-search-by-skill.png)

**Écriture avec autorisation — `add_project` :**

*"Ajoute un nouveau projet : nom 'Portfolio MCP Server'..."*

![Demande d'autorisation](screenshots/demo-3-add-project-request.png)
![Confirmation de l'ajout](screenshots/demo-4-add-project-result.png)

Ce serveur complète le [chatbot RAG](../portfolio-maryem) intégré à mon portfolio, mais répond à un besoin différent :

| | Chatbot RAG (portfolio) | Serveur MCP (ce projet) |
|---|---|---|
| **Public** | Visiteurs du portfolio | Moi-même, via un client MCP (Claude Desktop...) |
| **Données** | Documents non-structurés (Markdown) | Données structurées (JSON) |
| **Requêtes** | Recherche sémantique approximative | Filtres exacts (par entreprise, technologie...) |
| **Capacité** | Lecture seule | Lecture **et écriture** (`add_project`) |

Le RAG répond à des questions ouvertes en langage naturel. Le serveur MCP permet des requêtes précises et structurées — et surtout, permet de **mettre à jour** mes données directement depuis un assistant IA, sans toucher au code.

## Tools disponibles

- **`get_experiences(company?)`** — expériences professionnelles, filtrables par entreprise
- **`list_projects(technology?)`** — projets personnels, filtrables par technologie exacte
- **`get_skills(category?)`** — compétences par catégorie
- **`add_project(name, description, technologies, date)`** — ajoute un nouveau projet aux données (écriture)

## Installation

```bash
git clone <url-de-ce-repo>
cd portfolio-mcp-server
npm install
```

## Utilisation avec Claude Desktop

Ajoute ce serveur dans ton fichier de configuration Claude Desktop (`claude_desktop_config.json`) :

```json
{
  "mcpServers": {
    "portfolio": {
      "command": "node",
      "args": ["/chemin/absolu/vers/portfolio-mcp-server/src/server.js"]
    }
  }
}
```

Redémarre Claude Desktop. Les 4 tools apparaissent alors dans la conversation, et tu peux poser des questions comme :
- *"Quels projets de Maryem utilisent React.js ?"*
- *"Ajoute un nouveau projet : nom X, description Y, technologies [Z, W], date 2026."*

## Stack technique

Node.js, [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk), [Zod](https://zod.dev) pour la validation des schémas d'entrée, transport stdio.

## Structure

```
portfolio-mcp-server/
├── data/
│   ├── experiences.json
│   ├── projects.json
│   └── skills.json
├── src/
│   └── server.js
└── package.json
```
