#!/usr/bin/env node
import fs from "fs"
import path from "path"
import { execSync } from "child_process"
import inquirer from "inquirer";
import colors from "colors"
import os from "os"
import fse from "fs-extra"

const templatesFolder = path.join(os.homedir(), "AppData","Roaming","npm","node_modules", "@collinsadi", "microservice-setup","node_modules")

const generateMicroservice = async () => {
    
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter Microservice Name:",
            validate: (input) => input.trim() !== ''

        }
    ]);

    const { name } = answers;
    
    // Create a Folder with the Name that The user have specified

    fs.mkdirSync(name)
    
    // Puting the Path to the Created Folder inside a Variable to reuse

    const targetFolder = path.join(process.cwd(), name)

    // Creating the Folder to Hold the Brand Name, for Dynamic Brand Rendering

    fs.mkdirSync(path.join(targetFolder, "brand"))
    fs.writeFileSync(path.join(targetFolder, "brand", "brandName.js"), `const brandName = "Lingo Loom" \nconst brandInstagram = "" \nconst brandTwitter = "" \nconst brandEmail = "lingolooom@gmail.com" \n\n\nmodule.exports = {brandName, brandEmail}`)

    // Creating a folder to hold the configurations of the microservice, like database connection etc

    fs.mkdirSync(path.join(targetFolder, "config"))
    fs.writeFileSync(path.join(targetFolder, "config", "connectDb.js"), `require("dotenv").config()\nconst { MongoClient } = require("mongodb")\nconst url = process.env.MONGO_URI\nconst colors = require("colors")\n\nconst connectDatabase = async () => {
    try{
    const client = new MongoClient(url)
    await client.connect()
    
    console.log("Connected To MongoDB".green)
        
    return client
    
        
    } catch (error) {
        console.log("Error Connectiong to MongoDB"+ error)
    }
}

const userManagementDatabase = async () => {

    const client = await connectDatabase()
    const db = client.db("lingoloom")
    const User = db.collection("users")
    return User
}


module.exports = userManagementDatabase;`)
    
    // creating the controllers folder

    fs.mkdirSync(path.join(targetFolder, "controllers"))

    // creating the middlewares folder

    fs.mkdirSync(path.join(targetFolder, "middlewares"))
    fs.writeFileSync(path.join(targetFolder, "middlewares", "authMiddleware.js"), `const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwtsecret = process.env.JWT_SECRET
const handleError = require("../utils/errorHandler");


const authenticateUser = (request, response, next) => {
    
    if (request.headers.authorization && request.headers.authorization.startsWith("Bearer")) {
        
        const token = request.headers.authorization.split(" ")[1]

        try {
            
            const decoded = jwt.verify(token, jwtsecret)
            request.user = decoded.user

            next()
        } catch (error) {

            response.status(401).json(handleError(401, "Unauthorized", "The Client is Trying to Access an Authorized Endpoint with an Invalid Token"))
            console.log(error)
        }

    } else {
        response.status(401).json(handleError(401, "Unauthorized", "Authorization Header with Bearer Token Required"))
        
    }

}

module.exports = authenticateUser;`)
    
    // creating the models folder

    fs.mkdirSync(path.join(targetFolder, "models"))

    // creating the routes folder

    fs.mkdirSync(path.join(targetFolder, "routes"))

    // creating the templates folder for email Templates

    fs.mkdirSync(path.join(targetFolder, "templates"))
    fs.writeFileSync(path.join(targetFolder, "templates", "emailTemplate.js"), `// Your Email Templates can Be Exported from Here`)
    
    // Creating the utils Folder 

    fs.mkdirSync(path.join(targetFolder, "utils"))
    fs.writeFileSync(path.join(targetFolder, "utils", "emailSystem.js"), `const nodemailer = require("nodemailer")
    require("dotenv").config()



const sendEmail = (email, subject, html) => {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })

    const mailOptions = {

        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html
    }


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            return false
        } else {
            console.log(info)
            return true
        }
    })

}

module.exports = sendEmail;`)
    fs.writeFileSync(path.join(targetFolder, "utils", "errorHandler.js"), `
const handleError = ( code, message, details) => {
    
    return {

            status: false,
            message: message,
            error_code: code,
            error_details: details
            
            }

}


module.exports = handleError;`)
    
    // Finished Project Folders, Now Creating Project Configuration Files

    // creating .env file

    fs.writeFileSync(path.join(targetFolder, ".env"), `MONGO_URI=mongodb://127.0.0.1:27017\nPORT=5000\nJWT_SECRET=102030405060708090100`)

    // Creating Git Ignore File

    fs.writeFileSync(path.join(targetFolder, ".gitignore"), `node_modules/`)

    // Creating Index.js File

    fs.writeFileSync(path.join(targetFolder, "index.js"), `const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const colors = require("colors")



// Use Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())






app.listen(port, () => {
    console.log("Server Started".green);
})`)
    
    // creating the readme documentation file

    fs.writeFileSync(path.join(targetFolder, "README.md"), `
<!-- This Documentation Template was from the Content management microservice, please Edit-->

# Content Management Microservice Documentation

## Table of Contents
1. Introduction
2. Service Overview
   - 2.1. Purpose
   - 2.2. Functionality
3. API Endpoints
   - 3.1. Create Content
   - 3.2. Update Content
   - 3.3. Delete Content
4. Data Schema
   - 4.1. Content Data Structure
5. Security Measures
   - 5.1. Authentication
   - 5.2. Authorization
6. Error Handling
7. Performance and Scalability
8. Deployment
9. Testing
10. Maintenance and Support
11. Conclusion
12. Appendices
   - A. API Examples
   - B. Error Codes
   - C. References

## 1. Introduction
- This document provides detailed documentation for the Content Management Microservice, a crucial component of our English learning platform. It describes the microservice's purpose, functionality, API endpoints, data schema, security measures, and more.

## 2. Service Overview
### 2.1. Purpose
- The Content Management Microservice is responsible for creating, updating, and deleting lessons, quizzes, and multimedia content.

### 2.2. Functionality
- It enables administrators to manage content, including content creation, content editing, and content removal.

## 3. API Endpoints
- The Content Management Microservice offers the following API endpoints:

### 3.1. Create Content
- **Endpoint:** 
- **Description:** Allows administrators to create new content, including lessons, quizzes, and multimedia resources.
- **Request:** JSON data with content details.
- **Response:** Success message or error details.

### 3.2. Update Content
- **Endpoint:** 
- **Description:** Permits administrators to update existing content.
- **Request:** JSON data with content updates.
- **Response:** Success message or error details.

### 3.3. Delete Content
- **Endpoint:** 
- **Description:** Enables administrators to delete content items.
- **Request:** JSON data specifying the content to be deleted.
- **Response:** Success message or error details.

## 4. Data Schema
### 4.1. Content Data Structure
- The microservice uses a database schema to store content data, including content ID, title, description, media links, and other relevant information.

## 5. Security Measures
### 5.1. Authentication
- Content management is secured with proper authentication mechanisms to ensure only authorized administrators can create, update, or delete content.

### 5.2. Authorization
- Authorization mechanisms control access to specific content management functions based on administrative roles and permissions.

## 6. Error Handling
- The microservice provides clear and structured error responses, including error codes and descriptions for easy debugging.

## 7. Performance and Scalability
- The microservice is designed for performance and can be scaled horizontally to handle increased content management tasks.

## 8. Deployment
- Details the deployment environment, including dependencies and configuration settings.

## 9. Testing
- Describes the testing approach, including unit tests, integration tests, and user testing.

## 10. Maintenance and Support
- Discusses ongoing maintenance, monitoring, and administrator support.

## 11. Conclusion
- This documentation provides an in-depth understanding of the Content Management Microservice. It serves as a reference for administrators and developers to ensure effective content management within the platform.

## 12. Appendices
- Include additional information such as API request/response examples, error codes, and references.

This document serves as a comprehensive guide for the Content Management Microservice. It can be expanded and customized based on your project's specific requirements and needs.
`)

    console.log("Initializing Package File With Default Settings..".blue)
    
    // execSync(`cd ${name} && npm init -y`)

    console.log("Sucessfully Initialized Package File".green)
    console.log("Installing Required Packages...".blue)

    const packageFile = fs.readFileSync(path.join(os.homedir(), "AppData","Roaming","npm","node_modules", "@collinsadi", "microservice-setup", "package.json"), {encoding:"utf-8"}).toString()
    // const packageLockFile = fs.readFileSync(path.join(os.homedir(), "AppData","Roaming","npm","node_modules", "@collinsadi", "microservice-setup", "package-lock.json"), {encoding:"utf-8"}).toString()

   await fse.copy(templatesFolder, path.join(targetFolder, "node_modules"), (err) => {
        
        if (err) {
           return console.log(`Error Installing Packages`.red)
        } else {
            fs.writeFileSync(path.join(targetFolder, "package.json"), packageFile)
            // fs.writeFileSync(path.join(targetFolder, "package-lock.json"), packageLockFile)
            console.log("Micro Service Template Sucessfully Created".green)
        }
    })

    // execSync(`npm i colors dotenv express mongodb mongoose nodemailer shortid uuid`)



    //console.log("Micro Service Template Sucessfully Created".green)

}

generateMicroservice()