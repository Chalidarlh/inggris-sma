# mcp-inggris

Sistem Pembelajaran Bahasa Inggris SMA berbasis Model Context Protocol (MCP).

## Arsitektur

```
Claude Desktop (antarmuka guru)
       ↕ MCP via stdio
  /mcp-server  ← MCP server (Node.js/TypeScript)
       ↕ Supabase
  /web         ← Next.js dashboard guru + portal siswa
```

## Struktur Folder

```
/mcp-inggris
  /web          ← Next.js App Router (dashboard guru + portal siswa)
  /mcp-server   ← MCP server (dipanggil Claude Desktop)
  /docs         ← dokumen non-kode (proposal, kurikulum, rencana)
```

## Setup

### 1. Supabase

- Buat project di [supabase.com](https://supabase.com)
- Salin URL, anon key, dan service role key
- Isi ke `/web/.env.local` dan `/mcp-server/.env`

### 2. Web App

```bash
cd web
npm install
npm run dev    # → http://localhost:3000
```

### 3. MCP Server

```bash
cd mcp-server
npm install
npm run build
```

Daftarkan ke Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mcp-inggris": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-inggris/mcp-server/dist/server.js"]
    }
  }
}
```

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind v4 + shadcn/ui |
| MCP Server | Node.js + TypeScript + `@modelcontextprotocol/sdk` |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI | Claude via Claude Desktop |

## Tools MCP

| Tool | Fungsi |
|---|---|
| `create_material` | Generate draft materi untuk minggu tertentu |
| `get_pending_materials` | Lihat materi yang menunggu review |
| `publish_material` | Publikasikan materi ke kelas |
| `grade_writing_submission` | Nilai tulisan siswa berdasarkan rubrik |
| `approve_grade` | Setujui nilai AI agar resmi |

## Environment Variables

**`/web/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

**`/mcp-server/.env`**
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> ⚠️ Service role key TIDAK BOLEH masuk ke `/web` — hanya untuk `/mcp-server`.
