const execa = require("execa");

module.exports = function (snowpackConfig, pluginOptions) {
  return {
    name: "snowpack-custom-headers",
    async run({ log }) {
      console.log("headers running. your env:" + process.env.NODE_ENV);
      // Don't run the server when building
      if (process.env.NODE_ENV !== "development") {
        return;
      }

      const port = pluginOptions.port || "9001";
      log(`proxying headers on port ${port}`);

      const workerPromise = execa.node(`./proxy-server.js`, {
        env: {
          sch_proxy_port: port,
          sch_port: snowpackConfig.devOptions.port,
          sch_hostname: snowpackConfig.devOptions.hostname,
          sch_secure: snowpackConfig.devOptions.secure,
          sch_headers: Object.entries(pluginOptions.headers)
            .map(([key, val]) => `${key}:${val}`)
            .join(","),
        },
        extendEnv: true,
        windowsHide: false,
        cwd: __dirname,
      });

      try {
        execa.commandSync(
          `open "${snowpackConfig.devOptions.secure ? "https://" : "http://"}${
            snowpackConfig.devOptions.hostname
          }:${port}"`,
          { shell: true }
        );
      } catch (err) {
        console.log(err);
      }

      const { stdout, stderr } = workerPromise;

      function dataListener(chunk) {
        let stdOutput = chunk.toString();
        log("WORKER_MSG", { msg: stdOutput });
      }

      stdout && stdout.on("data", dataListener);
      stderr && stderr.on("data", dataListener);

      return workerPromise.catch((err) => {
        if (/ENOENT/.test(err.message)) {
          log("WORKER_MSG", {
            msg: 'WARN: "snowpack custom headers" run failed.',
          });
        }
        throw err;
      });
    },
  };
};
