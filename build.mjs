import { rmSync, cpSync } from "node:fs";
rmSync("dist", { recursive: true, force: true });
cpSync("public", "dist", { recursive: true });
console.log("Built: copied public/ -> dist/");
