const http = require("http"),
  httpProxy = require("http-proxy");

var proxy = httpProxy.createProxyServer({});

const {
  sch_headers: headers,
  sch_port: port,
  sch_secure: secure,
  sch_hostname: hostname,
  sch_proxy_port: proxy_port,
} = process.env;

const headersObj = headers.split(",").reduce((acc, curr) => {
  return {
    ...acc,
    [curr.split(":")[0]]: curr.split(":")[1],
  };
}, {});

proxy.on("proxyRes", function (proxyRes, req, res, options) {
  Object.entries(headersObj).forEach(([key, val]) => {
    proxyRes.headers[key] = val;
  });
});

proxy.on("error", function (proxyRes, req, res) {
  res.end();
});

var server = http.createServer(function (req, res) {
  proxy.web(req, res, {
    target: `${secure === "true" ? "https" : "http"}://${hostname}:${port}`,
  });
});

console.log(`Proxying headers on port ${proxy_port}`);

server.listen(proxy_port);
