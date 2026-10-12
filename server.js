const http = require('http');
const handler = require('serve-handler');

// Azure App Service provides the listen port via PORT env var.
const port = process.env.PORT || 8080;

// Enforce sign-in only after Entra ID is linked (App Service Authentication); set REQUIRE_AUTH=true then.
const requireAuth = process.env.REQUIRE_AUTH === 'true';
const AUTH_EXEMPT_PREFIXES = ['/.auth/'];

function isAuthExempt(url) {
  return AUTH_EXEMPT_PREFIXES.some((prefix) => url.startsWith(prefix));
}

function isAuthenticated(request) {
  // Easy Auth injects this header for the platform-verified signed-in user.
  return Boolean(request.headers['x-ms-client-principal']);
}

const server = http.createServer((request, response) => {
  if (requireAuth && !isAuthExempt(request.url) && !isAuthenticated(request)) {
    const redirectTarget = `/.auth/login/aad?post_login_redirect_uri=${encodeURIComponent(request.url)}`;
    response.writeHead(302, { Location: redirectTarget });
    response.end();
    return;
  }

  return handler(request, response, { public: __dirname });
});

server.listen(port, () => {
  console.log(`Static server running on port ${port}`);
});
