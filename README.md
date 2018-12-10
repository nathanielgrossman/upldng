# upldng
Simple image uploader for personal use. Will upload all jpgs in the current directory to a specified endpoint.

##Installation
`npm install -g upldng`

##Usage
Add a `upldng.config.json` file in the directory with the following properties:
```javascript
{
  "endpoint":"http://sample.com/upload"
}
```
Then, just navigate to that directory in your terminal and run `upldng`. You will be notified when each file uploads.