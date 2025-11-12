# Salary Tracker MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to your salary tracking data and operations.

## Features

### Resources
- **Salary Entries**: View all salary entries with hours, income, and tips
- **Weekly Summaries**: Aggregated weekly data including total hours and income
- **Statistics**: Overall statistics including averages and totals

### Tools
- **add_salary_entry**: Create new salary entries
- **update_salary_entry**: Update existing entries
- **delete_salary_entry**: Remove entries
- **calculate_weekly_hours**: Calculate hours for a specific week

## Setup

1. Install dependencies:
```bash
cd mcp-server
npm install
```

2. Set environment variable:
```bash
export SUPABASE_ANON_KEY="your-supabase-anon-key"
```

3. Build the server:
```bash
npm run build
```

## Usage with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "salary-tracker": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "SUPABASE_ANON_KEY": "your-supabase-anon-key"
      }
    }
  }
}
```

## Development

Run in development mode:
```bash
npm run dev
```

## Example Queries

Once configured, you can ask Claude:
- "Show me my salary entries from last week"
- "What's my average hourly rate?"
- "Add a new salary entry for today with 8 hours worked"
- "Calculate my total income this month"
- "What were my total hours in the week of January 1st?"

## Environment Variables

- `SUPABASE_ANON_KEY`: Your Supabase anonymous key (required)

## Security Note

This MCP server uses the Supabase anonymous key and relies on Row Level Security (RLS) policies in your database. Make sure your RLS policies are properly configured to protect user data.
