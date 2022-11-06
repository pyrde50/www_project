const http = require('http');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://fullstack-pyrde:dxT7WCQ0uaGVP3hd@cluster0.wkvz1sx.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const hostname = '0.0.0.0';
const port = 7777;
const port2 = 7778;

const stringIsAValidUrl = (s) => {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  };

  function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const changeASCIICodes = (str) => {
    if (str) {
    const newstr = str.replaceAll('%2F', '/').replaceAll('%26', '&').replaceAll('%3A', ':').replaceAll('%21', '!').replaceAll('%25', '%').replaceAll('%2B', '+')
    return newstr
} else {
    return ''
}

}
 
// Route handling
app.get('/', (req, res) => {
    res.write('<html><form action="/" method="post"><label for="url">Enter url: </label><input id="url" type="text" name="url" value="" /> <input type="submit" value="OK" /> </form></html>')
    res.end()
});

app.get('*', async (req, res) => {
    const callUrl = req.url.substring(1);
    const db = client.db('urls');
    const foundObject = await db.collection('collection-urls').findOne({newUrl: callUrl})
    const oldUrl = changeASCIICodes(foundObject?.oldUrl)
    if (oldUrl && stringIsAValidUrl(oldUrl)) {
        res.redirect(oldUrl)
        res.end()
    } else {
        res.status(404)
        res.end()
    }
})

app.post('/', async (req, res) => {
    const url = req.body.url;
    const db = client.db('urls');
    if (stringIsAValidUrl(url)) {
        const urlStringEnd = makeid(6)
        await db.collection('collection-urls').insertOne({newUrl: urlStringEnd, oldUrl: url});
        res.write(`<html><h2>New url: localhost:3002/${urlStringEnd}</h2></html>`)
        res.end();
    } else {
        res.status(400);
        res.write('<html><h1>Bad url, please try again<h/1></html>')
        res.end();
    }
})

const server = http.createServer(async (req, res) => {
    const db = client.db('urls');
    if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
        res.write('<html><form action="/" method="post"><label for="url">Enter url: </label><input id="url" type="text" name="url" value="" /> <input type="submit" value="OK" /> </form></html>')
        res.end();
    } else if (req.method === 'POST' && req.url === '/' || req.url === '') {
        const chunks = [];
        req.on("data", (chunk) => {
            chunks.push(chunk);
        });
        req.on("end", async () => {
            const data = Buffer.concat(chunks);
            const stringData = data.toString();
            const url = stringData.split('=')[1]
            // url on nyt vanha url
            const oldUrl = changeASCIICodes(url)
            if (oldUrl && stringIsAValidUrl(oldUrl)) {
                const urlStringEnd = makeid(6)
                await db.collection('collection-urls').insertOne({newUrl: urlStringEnd, oldUrl: oldUrl});
                res.write(`<html><h2>New url: localhost:3001/${urlStringEnd}</h2></html>`);
                res.end();
            } else {
                res.write('<html><h1>Bad url, please try again</h1></html>')
                res.end();
            }
          });
    } else {
        const reqUrl = req.url.substring(1);
        const foundObject = await db.collection('collection-urls').findOne({newUrl: reqUrl})
        const oldUrl = foundObject?.oldUrl
        if (foundObject && stringIsAValidUrl(oldUrl)) {
            res.writeHead(301, {Location: oldUrl})
            res.end()
        } else {
            res.statusCode = 404;
            res.end();
        }
    }
});

server.listen(port, hostname, () => {
  console.log(`Node running at http://${hostname}:${port}/`);
});

// Server setup
app.listen(port2,() => {
    console.log(`Express listening on port ${port2}`);
});

async function main() {
    try {
        await client.connect();
    } catch (error) {
        console.log(error);
    }
}

main().catch(console.error);

module.exports = {app, server}