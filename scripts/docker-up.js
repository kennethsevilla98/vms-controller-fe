import { spawn } from "child_process";
import path from "path";

// Get current folder name
const projectName = path.basename(process.cwd());

console.log(`🚀 Starting docker with project name: ${projectName}`);

const child = spawn("docker", ["compose", "up", "-d"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PROJECT_NAME: projectName, // pass PROJECT_NAME to compose
  },
});

child.on("close", (code) => {
  if (code !== 0) {
    console.error(`❌ docker compose exited with code ${code}`);
    process.exit(code);
  }
});
