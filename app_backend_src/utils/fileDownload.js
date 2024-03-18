//Use Core FileSystem and HTTP Modules to Download Files
//Download Tutorial : https://www.youtube.com/watch?v=ogF_WMzUqok
const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');
const os = require('os'); 
const dotenv = require('dotenv');
dotenv.config();

const httpReadAndSave = async (fileURL) => {
    //Initialise Download Directory
    prepareDownloadDirectory();

    //Get File Name
    const fileName = path.basename(fileURL);

    //Add to Download Directory Path
    const downloadDirectoryPath = path.join(os.homedir(),process.env.DOWNLOAD_DIRECTORY);
    const filePath = path.join(downloadDirectoryPath,fileName);
    
    //Create GET Request to Download
    const downloadRequest = http.get(fileURL, function (response) {
        //Create Write Stream To Save
        const fileWriteStream = fs.createWriteStream(filePath);

        //Call PIPE to direct ReadableStream to WriteableStream
        response.pipe(fileWriteStream);

        //Close Write Stream
        fileWriteStream.on('finish', function () {
            fileWriteStream.close();
        });
    })
}

const httpsReadAndSave = async (fileURL) => {
    //Initialise Download Directory
    prepareDownloadDirectory();

    //Get File Name
    const fileName = path.basename(fileURL);

    //Add to Download Directory Path
    const downloadDirectoryPath = path.join(os.homedir(),process.env.DOWNLOAD_DIRECTORY);
    const filePath = path.join(downloadDirectoryPath,fileName);
    
    //Create GET Request to Download
    const downloadRequest = https.get(fileURL, function (response) {
        //Create Write Stream To Save
        const fileWriteStream = fs.createWriteStream(filePath);

        //Call PIPE to direct ReadableStream to WriteableStream
        response.pipe(fileWriteStream);

        //Close Write Stream
        fileWriteStream.on('finish', function () {
            fileWriteStream.close();
        });
    })  
}

//Create Directory Tutorial : https://www.geeksforgeeks.org/how-to-create-a-directory-using-node-js/
const prepareDownloadDirectory = async () => {
    const downloadDirectoryPath = path.join(os.homedir(),process.env.DOWNLOAD_DIRECTORY);
    fs.access(downloadDirectoryPath, (error) => {
        //To check if the given directory already exists
        if(error){
            //If current directory does not exist create it
            fs.mkdir(downloadDirectoryPath, (error) => {
                if(error){
                    console.log(error);
                }else{
                    console.log("Download Directory Created");
                }
            });
        }else{
            console.log("Download Directory Exist");
        }
    });
}

const downloadFromURL = async (fileURL) => {
    //Try HTTPS Then HTTP
    var tryHTTP = false;

    //Try HTTPS
    try{
        httpsReadAndSave(fileURL);
    }catch(error){
        //If Error Protocol Try HTTP
        if(error.code == Error.ERR_INVALID_PROTOCOL){
            tryHTTP = true;
        }else{
            //Tell User Download Failed
            return false;
        }
    }

    //Try HTTP
    if(tryHTTP){
        try{
            httpReadAndSave(fileURL);
        }catch(error){
            //Tell User Download Failed
            return false;
        }
    }

    //Tell User Download Succeed
    return true;
}

module.exports = {
    downloadFromURL,
}
