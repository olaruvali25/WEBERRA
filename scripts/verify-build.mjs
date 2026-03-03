import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const command = isWindows ? "cmd.exe" : "npx";
const args = isWindows ? ["/c", "npx", "next", "build"] : ["next", "build"];

const result = spawnSync(command, args, {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: ".next-build"
  },
  shell: false
});

process.exit(result.status ?? 1);
