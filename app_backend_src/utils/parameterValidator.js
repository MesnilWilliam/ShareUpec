//Types and Continuity of Parameters Verified By Some Functions
const emailValidator = require('email-validator');
const dotenv = require('dotenv');
dotenv.config();


const isResolvableToNumber = (value) => {
    //Cast and Check for Strings As NaN
    if(isNaN(Number(value))){
        return false;
    }

    return true;
}

const isNonNumericString = (value) => {
    //Cast and Check for Strings As NaN
    //Could be handled better
    return isNaN(Number(value));
}

const isShareCodeValid = (token) => {
    //ShareCode is UUID4 Token Composed of 32 Chars Separated in 5 Groups
    if(!isNonNumericString(token)){
        return false;
    }

    if(token.length < 32){
        return false;
    }

    if(token.length > (32+4)){
        return false;
    }

    if(token.split('-').length != 5){
        return false;
    }

    var isSeparationValid = true;
    const separatedToken = token.split('-');
    isSeparationValid = (separatedToken[0].length == 8) ? isSeparationValid : false;
    isSeparationValid = (separatedToken[1].length == 4) ? isSeparationValid : false;
    isSeparationValid = (separatedToken[2].length == 4) ? isSeparationValid : false;
    isSeparationValid = (separatedToken[3].length == 4) ? isSeparationValid : false;
    isSeparationValid = (separatedToken[4].length == 12) ? isSeparationValid : false;

    if(!isSeparationValid){
        return false;
    }

    return true;
}

const isEmailValid = (email) => {
    //Check Email
    return emailValidator.validate(email);
}

const isCycleValid = (cycle) => {
    //Check Cycle
    const validCycles = [process.env.CYCLE_1,
        process.env.CYCLE_2,
        process.env.CYCLE_3,
        process.env.CYCLE_4,
        process.env.CYCLE_5];
    
    return validCycles.includes(cycle);
}

const isDeclaredFileExtensionValid = (declaredExtension) => {
    //Check Declared
    const validExtension = [process.env.EXTENSION_1,
        process.env.EXTENSION_2,
        process.env.EXTENSION_3];
    
    return validExtension.includes(declaredExtension);
}

const isFileExtensionValid = (filePath,declaredExtension) => {
    //Use Path to Get Extension
    filePathExtension = path.extname(path.basename(filePath)).substring(1);

    //Cas URL : Check If Path Querry String
    if(filePathExtension.include('?')){
        filePathExtension = filePathExtension.split('?')[0];
    }

    //Compare to Declared Extension
    if(filePathExtension !== declaredExtension){
        return false;
    }

    return true;
}

module.exports = {
    isResolvableToNumber,
    isNonNumericString,
    isShareCodeValid,
    isEmailValid,
    isCycleValid,
    isDeclaredFileExtensionValid,
    isFileExtensionValid
}
