const http = require('http');
const handler = require('serve-handler');

// Azure App Service provides the listen port via PORT env var.
const port = process.env.PORT || 8080;

const server = http.createServer((request, response) => {
  return handler(request, response, { public: __dirname });
});

server.listen(port, () => {
  console.log(`Static server running on port ${port}`);
});
