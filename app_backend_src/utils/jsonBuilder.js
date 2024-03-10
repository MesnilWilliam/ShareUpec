//Associate Key Vaues to Build JSON Object
const simpleResponse = (route,data) => {
    //Declare Response JSON
    response = {};

    //Build Response JSON
    response['route'] = route;
    response['data'] = data;

    return response;
};

const buildResponse = (keys,values,route,data) => {
    //Check Length
    if(keys.length !== values.length){
        return simpleResponse(route,data);
    }

    //Declare Response JSON
    response = {};


    //Build Pairs
    for(let i=0;i<keys.length;i++){
        response[keys[i]] = values[i];
    }

    //Build Response JSON
    response['route'] = route;
    response['data'] = data;

    return response;
};

module.exports = {
    simpleResponse,
    buildResponse
};
