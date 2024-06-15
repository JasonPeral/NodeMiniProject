//This module will allow us to read and write files
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate')


//FILE READING SECTION

//Here we are taking text thats in this directory from txt folder and there are 
//2 parameters that we have to fill in - the path and the file type
//We have to attach it to a variable because there is an output to this which is the output of the file
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput)

// //Here we are making a new text string that we are going to write to a new file that we will create.
// const textOutput = `This is what we know about the acovado ${textInput}. \nCreated on ${Date.now()}`;
// //fs.writeFileSync allows us to create a file that is not made. Once I run this node.js file it will create a new txt file named output.txt
// //The contents of it is in the 2nd argument textOutput 
// fs.writeFileSync('./txt/output.txt', textOutput)
// //This is to just notify what just happened
// console.log('a new file has been written')


//Non-blocking asynchronous code(reading a file)
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return console.log("Error");
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2} \n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written...')
//             })

//         })
//     })
// })
// //This console.log will get executed first before the fs.readFile comes up with a result
// console.log('reading file...')

//SERVER SECTION
//We created a server with a call back function within it
//Whenever a new request to the server is triggered the callback function is gets fired as well

//Here We are reading the api data synchronously
//Then parses the data into an object prodData


//Replaced this function with a module we made in the module folder
// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NURTIENTS%}/g, product.nurtients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const prodData = JSON.parse(data);

const SERVER = http.createServer((req, res) => {
    //Here I am assining the request for a url to the variable pathName



    const { query, pathname } = url.parse(req.url, true);
    const pathName = req.url;

    //Defining what I want to do based on pathnames hit
    //Overview page
    if (pathname === '/' || pathname === '/overview') {
        //This text is going to appear when either of these paths get hit
        res.writeHead(200, { 'Content-type': 'text/html' });

        //We are looping through the json from the prodData variable that parses the json and puts it into an array
        //In each iteration we are replacing the placeholders in the templateCard with the current product which is also current element
        const cardsHtml = prodData.map(el => replaceTemplate(templateCard, el)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        //console.log(cardsHtml);

        res.end(output);
    }
    //Product Page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const product = prodData[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output);
    }
    //When the api path gets hit we add headers of content type json and res.end the data object to the page
    //API
    else if (pathname === "/api") {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);


    }
    //In this else I write a header that is 404 which means page not found in HTTP responses
    //But also I can create any header I want and it would appear in the network section of the develoepr tool
    //Page not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'myOwnHeader': 'helloWorld'
        });
        res.end('<h1>404 Page Not found</h1>');
    }

})

//Here we are listening to incoming requests on the local host IP which we explicitly declared here and on PORT 8000
//Once running we did this request by hitting that adress and port 
//Which triggers the call back function within the created server
SERVER.listen(8000, '127.0.0.1', () => {
    console.log('Listen to requests on port 8000');
})
