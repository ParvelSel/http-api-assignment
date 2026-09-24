// main replier
const respond = (request, response, status, info, type) => {
    response.writeHead(status, { 'Content-Type': type });
    response.write(info);
    response.end();
}

//Formatter
const replyBuilder = (acceptedTypes, message, id=null) => {
    //XML Case
    if(acceptedTypes.includes('application/xml') || acceptedTypes.includes('text/xml')) {
        let xmlReply = '<response>';
        xmlReply += `<message>${message}</message>`;
        if (id) {
            xmlReply += `<id>${id}</id>`;
        }
        xmlReply += '</response>';
        return { payload: xmlReply, type: 'text/xml' };
    }

    //JSON Case
    const jsonReply = { message };
    if (id) {
        jsonReply.id = id;
    }
    return { payload: JSON.stringify(jsonReply), type: 'application/json' };
};

//Success Case
const getSuccess = (request, response, acceptedTypes) => {
    const {payload, type} = replyBuilder(acceptedTypes, 'Success');
    respond(request, response, 200, payload, type);
};

//Bad Request Case
const getBadRequest = (request, response, acceptedTypes, query) => {
    //Check for the ?qurey at the top
    if(query && query.valid === "true"){
        const {payload, type} = replyBuilder(acceptedTypes, 'This request has the required valid parameter', 'Success');
        respond(request, response, 200, payload, type);
        return;
    }

    //When missing param
    const {payload, type} = replyBuilder(acceptedTypes, 'Missing required parameter', 'Bad Request');
    respond(request, response, 400, payload, type);
};

//Unauthorized Case
const getUnauthorized = (request, response, acceptedTypes, query) => {
    //Check for the ?loggedIn at the top
    if(query && query.loggedIn === "yes"){
        const {payload, type} = replyBuilder(acceptedTypes, 'You have successfully logged in', 'Success');
        respond(request, response, 200, payload, type);
        return;
    }

    //when its not there or not yes
    const {payload, type} = replyBuilder(acceptedTypes, 'Missing loggedIn query parameter set to yes', 'Unauthorized');
    respond(request, response, 401, payload, type);
};

//Forbidden Case
const getForbidden = (request, response, acceptedTypes) => {
    const {payload, type} = replyBuilder(acceptedTypes, 'You do not have access to this content', 'Forbidden');
    respond(request, response, 403, payload, type);
};

//Internal Server Error Case
const getInternal = (request, response, acceptedTypes) => {
    const {payload, type} = replyBuilder(acceptedTypes, 'Internal Server Error. Something went wrong.', 'Internal Server Error');
    respond(request, response, 500, payload, type);
};

//Not Implemented Case
const getNotImplemented = (request, response, acceptedTypes) => {
    const {payload, type} = replyBuilder(acceptedTypes, 'A get request for this page has not been implemented yet. Check again later for updaed content.', 'Not Implemented');
    respond(request, response, 501, payload, type);
}

//Not Found Case
const notFound = (request, response, acceptedTypes) => {
    const {payload, type} = replyBuilder(acceptedTypes, 'The page you are looking for was not found.', 'Resource Not Found');
    respond(request, response, 404, payload, type);
};

//Exporter
module.exports = {
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    notFound
};