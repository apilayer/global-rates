module.exports = {
  apps: [
    {
      name: "globalrates",
      cwd: "/var/www/devtools/global-rates",
      script: "npm",
      args: "start -- -p 3004",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false
    }
  ]
};