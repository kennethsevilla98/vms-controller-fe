import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import chokidar from "chokidar";
import treeKill from "tree-kill";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceEnvPath = path.join(__dirname, "../src/envs/.env.development");
const targetEnvPath = path.join(__dirname, "../.env");

let devServer = null;

function copyEnvFile() {
  try {
    const envContent = fs.readFileSync(sourceEnvPath, "utf8");
    fs.writeFileSync(targetEnvPath, envContent);
    console.log("✅ DEVELOPMENT environment variables copied successfully");

    if (devServer) {
      console.log("🔄 Restarting Vite dev server...");
      treeKill(devServer.pid, "SIGTERM", () => {
        startDevServer();
      });
    }
  } catch (error) {
    console.error("❌ Error copying environment variables:", error.message);
  }
}

function startDevServer() {
  console.log("🚀 Starting Vite dev server...");
  devServer = spawn("vite", ["--port", "3000"], {
    stdio: "inherit",
    shell: true,
  });

  devServer.on("error", (err) => {
    console.error("❌ Failed to start Vite dev server:", err);
  });

  devServer.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`⚠️ Vite dev server exited with code ${code}`);
    }
    devServer = null;
  });
}

// Initial setup
copyEnvFile();
startDevServer();

// Watch with chokidar for reliable FS events
chokidar.watch(sourceEnvPath).on("change", () => {
  console.log("👀 Detected changes in .env.development");
  copyEnvFile();
});
