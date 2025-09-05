import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if --production flag is provided
const isProduction = process.argv.includes("--production");
const envType = isProduction ? "production" : "development";

const sourceEnvPath = path.join(__dirname, `../src/envs/.env.${envType}`);
const targetEnvPath = path.join(__dirname, "../.env");

function copyEnvFile() {
  try {
    // Read the environment file
    const envContent = fs.readFileSync(sourceEnvPath, "utf8");

    // Write to the root .env file
    fs.writeFileSync(targetEnvPath, envContent);

    console.log(
      `✅ ${envType.toUpperCase()} environment variables copied successfully`
    );
  } catch (error) {
    console.error("❌ Error copying environment variables:", error.message);
    process.exit(1);
  }
}

// Initial copy
copyEnvFile();

// Check if --no-watch flag is provided
const shouldWatch = !process.argv.includes("--no-watch");

// Watch for changes only if not using --no-watch
if (shouldWatch) {
  fs.watch(sourceEnvPath, (eventType, filename) => {
    if (eventType === "change") {
      console.log(`🔄 Detected changes in ${filename}`);
      copyEnvFile();
    }
  });

  console.log(`👀 Watching for changes in .env.${envType}...`);
}
