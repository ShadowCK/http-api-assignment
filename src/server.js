// Import modules
const http = require('http');
const url = require('url');
const query = require('querystring');
// Import scripts
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const xmlHandler = require('./xmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  json: {
    GET: {
      '/': htmlHandler.getIndex,
      '/style.css': htmlHandler.getCSS,
      '/success': jsonHandler.getSuccess,
      '/badRequest': jsonHandler.getBadRequest,
      '/unauthorized': jsonHandler.getUnauthorized,
      '/forbidden': jsonHandler.getForbidden,
      '/internal': jsonHandler.getInternal,
      '/notImplemented': jsonHandler.getNotImplemented,
      default: jsonHandler.getNotFound,
    },
  },
  xml: {
    GET: {
      '/': htmlHandler.getIndex,
      '/success': xmlHandler.getSuccess,
      '/badRequest': xmlHandler.getBadRequest,
      '/unauthorized': xmlHandler.getUnauthorized,
      '/forbidden': xmlHandler.getForbidden,
      '/internal': xmlHandler.getInternal,
      '/notImplemented': xmlHandler.getNotImplemented,
      default: xmlHandler.getNotFound,
    },
  },
};

// handle GET requests
const handleGet = (request, response, parsedUrl, format) => {
  const { pathname } = parsedUrl;
  // Parse the query parameters
  const params = query.parse(parsedUrl.query);
  // route to correct method based on url and format
  const handler = urlStruct[format].GET[pathname] || urlStruct[format].GET.default;
  handler(request, response, params);
};

const onRequest = (request, response) => {
  // Parse the url into an object
  const parsedUrl = url.parse(request.url);

  // Check Accept header to determine response format, default to json
  const acceptHeader = request.headers.accept || 'application/json';
  let format = 'json';
  if (acceptHeader.includes('text/xml')) {
    format = 'xml';
  }
  if (acceptHeader.includes('application/json')) {
    format = 'json';
  }

  // Our HTTP API is only responsible for GET requests for now!
  // We simply assume the request is a GET request.
  handleGet(request, response, parsedUrl, format);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
