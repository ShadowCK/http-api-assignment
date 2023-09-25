// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// Define handlers for various JSON responses
const getSuccess = (request, response) => {
  const responseJSON = {
    message: 'This is a successful response',
  };

  respondJSON(request, response, 200, responseJSON);
};

const getBadRequest = (request, response, params) => {
  const responseJSON = params.valid === 'true'
    ? { message: 'This request has the required parameters' }
    : { message: 'Missing valid query parameter set to true', id: 'badRequest' };

  const statusCode = params.valid === 'true' ? 200 : 400;

  respondJSON(request, response, statusCode, responseJSON);
};

const getUnauthorized = (request, response, params) => {
  const responseJSON = params.loggedIn === 'yes'
    ? { message: 'You are authorized' }
    : { message: 'Missing loggedIn query parameter set to yes', id: 'unauthorized' };

  const statusCode = params.loggedIn === 'yes' ? 200 : 401;

  respondJSON(request, response, statusCode, responseJSON);
};

const getForbidden = (request, response) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respondJSON(request, response, 403, responseJSON);
};

const getInternal = (request, response) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondJSON(request, response, 500, responseJSON);
};

const getNotImplemented = (request, response) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  respondJSON(request, response, 501, responseJSON);
};

const getNotFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

// Export handlers
module.exports = {
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
