import express from "express";
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Handle preflight requests
app.options("/projects", (req, res) => {
  res.status(200).end();
});

// Notion API route
app.get("/projects", async (req, res) => {
  try {
    // Initialize Notion client
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const DATABASE_ID = "24f9fb57f9ce810b888cee7ec2847461";

    // Fetch data from Notion database
    const notionResponse = await notion.databases.query({
      database_id: DATABASE_ID,
    });

    // Process the data to extract relevant information
    const projects = notionResponse.results.map((page) => {
      const properties = page.properties;

      // Helper functions to extract property values
      const getTitle = (prop) => {
        if (!prop) return "";
        if (prop.title) return prop.title.map((t) => t.plain_text).join("");
        return "";
      };

      const getText = (prop) => {
        if (!prop) return "";
        if (prop.rich_text)
          return prop.rich_text.map((t) => t.plain_text).join("");
        return "";
      };

      const getUrl = (prop) => {
        if (!prop) return "";
        if (prop.url) return prop.url;
        return "";
      };

      const getStatus = (prop) => {
        if (!prop) return "";
        if (prop.status) return prop.status.name || "";
        return "";
      };

      const getDateRange = (prop) => {
        if (!prop) return "";
        if (prop.date) {
          const { start, end } = prop.date;
          if (start && end) return `${start} to ${end}`;
          if (start) return start;
        }
        return "";
      };

      const getTools = (prop) => {
        if (!prop) return [];
        if (prop.multi_select) {
          return prop.multi_select.map((item) => item.name);
        }
        return [];
      };

      // Extract project data with the correct property names
      const title = getTitle(properties.Name || {});
      const description = getText(properties["Project Description"] || {});
      const status = getStatus(properties.Status || {});
      const projectLink = getUrl(properties["Project Link"] || {});
      const dateRange = getDateRange(properties["Date Range"] || {});
      const tools = getTools(properties.Tools || {});

      return {
        id: page.id,
        title,
        description,
        status,
        projectLink,
        dateRange,
        tools,
      };
    });

    // Return the projects data
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    res.status(500).json({
      error: "Failed to fetch projects from Notion",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
