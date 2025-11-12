#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ulwsrrouznidyhzehjxv.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const server = new Server(
  {
    name: "salary-tracker-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "salary://entries",
        mimeType: "application/json",
        name: "Salary Entries",
        description: "All salary entries with hours worked, income, and tips",
      },
      {
        uri: "salary://weekly-summaries",
        mimeType: "application/json",
        name: "Weekly Summaries",
        description: "Weekly aggregated salary data including total hours and income",
      },
      {
        uri: "salary://stats",
        mimeType: "application/json",
        name: "Statistics",
        description: "Overall statistics including total income, hours, and averages",
      },
    ],
  };
});

// Read resource data
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === "salary://entries") {
    const { data, error } = await supabase
      .from("salary_entries")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  if (uri === "salary://weekly-summaries") {
    const { data: entries, error } = await supabase
      .from("salary_entries")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

    // Group by week
    const weekMap = new Map();
    entries?.forEach((entry) => {
      const startDate = new Date(entry.start_date);
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() - startDate.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weekMap.has(weekKey)) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekMap.set(weekKey, {
          weekStart: weekKey,
          weekEnd: weekEnd.toISOString().split("T")[0],
          totalHours: 0,
          totalExtraHours: 0,
          totalIncome: 0,
          totalTips: 0,
          entries: [],
        });
      }

      const week = weekMap.get(weekKey);
      week.totalHours += Number(entry.hours_worked);
      week.totalExtraHours += Number(entry.extra_hours || 0);
      week.totalIncome += Number(entry.base_salary) + Number(entry.tips || 0);
      week.totalTips += Number(entry.tips || 0);
      week.entries.push(entry);
    });

    const summaries = Array.from(weekMap.values());

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(summaries, null, 2),
        },
      ],
    };
  }

  if (uri === "salary://stats") {
    const { data: entries, error } = await supabase
      .from("salary_entries")
      .select("*");

    if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

    const totalHours = entries?.reduce(
      (sum, e) => sum + Number(e.hours_worked),
      0
    );
    const totalExtraHours = entries?.reduce(
      (sum, e) => sum + Number(e.extra_hours || 0),
      0
    );
    const totalIncome = entries?.reduce(
      (sum, e) => sum + Number(e.base_salary) + Number(e.tips || 0),
      0
    );
    const totalTips = entries?.reduce((sum, e) => sum + Number(e.tips || 0), 0);

    const stats = {
      totalEntries: entries?.length || 0,
      totalHours: totalHours || 0,
      totalExtraHours: totalExtraHours || 0,
      totalIncome: totalIncome || 0,
      totalTips: totalTips || 0,
      averageHourlyRate:
        totalHours > 0 ? (totalIncome || 0) / (totalHours || 1) : 0,
    };

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add_salary_entry",
        description: "Add a new salary entry with hours worked, income, and tips",
        inputSchema: {
          type: "object",
          properties: {
            user_id: {
              type: "string",
              description: "User ID for the entry",
            },
            start_date: {
              type: "string",
              description: "Start date in YYYY-MM-DD format",
            },
            end_date: {
              type: "string",
              description: "End date in YYYY-MM-DD format",
            },
            hours_worked: {
              type: "number",
              description: "Total hours worked",
            },
            extra_hours: {
              type: "number",
              description: "Extra hours worked (overtime)",
            },
            base_salary: {
              type: "number",
              description: "Base salary amount",
            },
            tips: {
              type: "number",
              description: "Tips received",
            },
            currency: {
              type: "string",
              description: "Currency code (e.g., USD, CAD)",
            },
            description: {
              type: "string",
              description: "Optional description for the entry",
            },
          },
          required: ["user_id", "start_date", "end_date", "hours_worked", "base_salary"],
        },
      },
      {
        name: "update_salary_entry",
        description: "Update an existing salary entry",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Entry ID to update",
            },
            hours_worked: {
              type: "number",
              description: "Updated hours worked",
            },
            extra_hours: {
              type: "number",
              description: "Updated extra hours",
            },
            base_salary: {
              type: "number",
              description: "Updated base salary",
            },
            tips: {
              type: "number",
              description: "Updated tips",
            },
            description: {
              type: "string",
              description: "Updated description",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_salary_entry",
        description: "Delete a salary entry by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Entry ID to delete",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "calculate_weekly_hours",
        description: "Calculate total hours for a specific week",
        inputSchema: {
          type: "object",
          properties: {
            week_start: {
              type: "string",
              description: "Week start date in YYYY-MM-DD format",
            },
          },
          required: ["week_start"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "add_salary_entry") {
    const { data, error } = await supabase.from("salary_entries").insert([
      {
        user_id: args.user_id,
        start_date: args.start_date,
        end_date: args.end_date,
        hours_worked: args.hours_worked,
        extra_hours: args.extra_hours || 0,
        base_salary: args.base_salary,
        tips: args.tips || 0,
        currency: args.currency || "USD",
        description: args.description,
      },
    ]).select();

    if (error) throw new Error(`Failed to add entry: ${error.message}`);

    return {
      content: [
        {
          type: "text",
          text: `Successfully added salary entry: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  if (name === "update_salary_entry") {
    const updates: any = {};
    if (args.hours_worked !== undefined) updates.hours_worked = args.hours_worked;
    if (args.extra_hours !== undefined) updates.extra_hours = args.extra_hours;
    if (args.base_salary !== undefined) updates.base_salary = args.base_salary;
    if (args.tips !== undefined) updates.tips = args.tips;
    if (args.description !== undefined) updates.description = args.description;

    const { data, error } = await supabase
      .from("salary_entries")
      .update(updates)
      .eq("id", args.id)
      .select();

    if (error) throw new Error(`Failed to update entry: ${error.message}`);

    return {
      content: [
        {
          type: "text",
          text: `Successfully updated salary entry: ${JSON.stringify(data, null, 2)}`,
        },
      ],
    };
  }

  if (name === "delete_salary_entry") {
    const { error } = await supabase
      .from("salary_entries")
      .delete()
      .eq("id", args.id);

    if (error) throw new Error(`Failed to delete entry: ${error.message}`);

    return {
      content: [
        {
          type: "text",
          text: `Successfully deleted salary entry with ID: ${args.id}`,
        },
      ],
    };
  }

  if (name === "calculate_weekly_hours") {
    const weekStart = new Date(args.week_start);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const { data: entries, error } = await supabase
      .from("salary_entries")
      .select("*")
      .gte("start_date", weekStart.toISOString().split("T")[0])
      .lte("start_date", weekEnd.toISOString().split("T")[0]);

    if (error) throw new Error(`Failed to fetch entries: ${error.message}`);

    const totalHours = entries?.reduce((sum, e) => sum + Number(e.hours_worked), 0) || 0;
    const totalExtraHours = entries?.reduce((sum, e) => sum + Number(e.extra_hours || 0), 0) || 0;

    return {
      content: [
        {
          type: "text",
          text: `Week of ${args.week_start}: ${totalHours} regular hours, ${totalExtraHours} extra hours (${totalHours + totalExtraHours} total)`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Salary Tracker MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
