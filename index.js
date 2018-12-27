#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const average = require('image-average-color');

const configFile = path.resolve(process.cwd(), 'upldng.config.json');
const config = parseConfig(configFile)

const dir = path.resolve(process.cwd())

sendImages(dir, config)

function parseConfig(configFile) {
    if (fs.existsSync(configFile)) {
        let config = JSON.parse(fs.readFileSync(configFile))
        return config;
    } else {
        console.error('No config file present in current directory.');
        process.exit(1);
    }
}

function sendImages(dir, config) {
    fs.readdir(dir, (err, files) => {
        const matched = files.filter(file => {
            let ln = file.length - 4;
            return (file.substr(ln) == '.jpg')
        })
        matched.forEach(image => {
            processImage(image, config)
        })
    })
}

function processImage(image, config) {
    let imagePath = path.resolve(process.cwd(), image);
    let imageFile = fs.readFileSync(imagePath);
    if (config.average) {
        average(imageFile, (err, color) => {
            if (err) console.log(err);
            else {
                console.log(color);
                upload(config.endpoint, imageFile, imagePath, image, color);
            }
        })
    } else {
        upload(config.endpoint, imageFile, imagePath, image)
    }
}

function upload(endpoint, buffer, filepath, name, color) {
    let config = {
        data: buffer,
        name: name
    }
    if (color) config.color = color;
    axios.post(endpoint, config)
        .then(response => {
            console.log(`Upload of ${name} successful.`)
            fs.unlink(filepath, err => {
                if (err) console.log(err)
                else console.log(`${name} deleted.`);;
            })
        })
        .catch(error => {
            console.log(error)
        });
}