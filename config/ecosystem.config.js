module.exports = {
  apps: [
    {
      name: "global-rates",
      cwd: process.env.RELEASE_DIR,
      script: "npm",
      args: "start -- -p 3004",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false
    }
  ]
};
