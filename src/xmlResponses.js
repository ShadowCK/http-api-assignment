// utility function to convert a JavaScript object to XML
const js2xml = (obj, node) => {
  let xml = '';

  Object.entries(obj).forEach(([prop, value]) => {
    xml += Array.isArray(value) ? '' : `<${prop}>`;
    if (Array.isArray(value)) {
      value.forEach((arrayItem) => {
        xml += `<${prop}>`;
        xml += js2xml({ ...arrayItem }, node); // Use spread syntax to create a new object
        xml += `</${prop}>`;
      });
    } else if (typeof value === 'object') {
      xml += js2xml({ ...value }, node); // Use spread syntax to create a new object
    } else {
      xml += value;
    }
    xml += Array.isArray(value) ? '' : `</${prop}>`;
  });

  const xmlString = `<${node}>${xml}</${node}>`;
  return xmlString;
};

// function to respond with an XML object
const respondXML = (request, response, status, object) => {
  const xmlResponse = js2xml(object, 'response');
  response.writeHead(status, { 'Content-Type': 'text/xml' });
  response.write(xmlResponse);
  response.end();
};

const getSuccess = (request, response) => {
  const responseXML = {
    message: 'This is a successful response',
  };

  respondXML(request, response, 200, responseXML);
};

const getBadRequest = (request, response, params) => {
  const responseXML = params.valid === 'true'
    ? { message: 'This request has the required parameters' }
    : { message: 'Missing valid query parameter set to true', id: 'badRequest' };

  const statusCode = params.valid === 'true' ? 200 : 400;

  respondXML(request, response, statusCode, responseXML);
};

const getUnauthorized = (request, response, params) => {
  const responseXML = params.loggedIn === 'yes'
    ? { message: 'You are authorized' }
    : { message: 'Missing loggedIn query parameter set to yes', id: 'unauthorized' };

  const statusCode = params.loggedIn === 'yes' ? 200 : 401;

  respondXML(request, response, statusCode, responseXML);
};

const getForbidden = (request, response) => {
  const responseXML = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respondXML(request, response, 403, responseXML);
};

const getInternal = (request, response) => {
  const responseXML = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondXML(request, response, 500, responseXML);
};

const getNotImplemented = (request, response) => {
  const responseXML = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  respondXML(request, response, 501, responseXML);
};

const getNotFound = (request, response) => {
  const responseXML = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondXML(request, response, 404, responseXML);
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
