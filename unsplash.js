import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import fs from 'fs';
import { google } from 'googleapis';
import axios from 'axios';
import open from 'open';
import { createInterface } from 'readline';
import path from 'path';

const CLIENT_ID = '247333812838-vk9g3kah30i5g3cl0h4p5eq2k0cc9t35.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://www.tech4seniors.de/';
const SCOPES = ['https://www.googleapis.com/auth/photoslibrary'];

const credentials = { client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uris: [REDIRECT_URI] };

const auth = new google.auth.OAuth2(credentials.client_id, credentials.client_secret, credentials.redirect_uris[0]);

const tokenPath = 'token.json';

async function main() {
    try {
        const token = await fs.promises.readFile(tokenPath, 'utf8');
        auth.setCredentials(JSON.parse(token));
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Token file doesn't exist, initiate the OAuth 2.0 flow
            const authUrl = auth.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            });

            console.log('Authorize this app by visiting this URL:', authUrl);
            await open(authUrl, { wait: false });

            const code = await getCodeFromUser();
            const { tokens } = await auth.getToken(code);
            auth.setCredentials(tokens);

            // Save the tokens to the token file
            await fs.promises.writeFile(tokenPath, JSON.stringify(tokens));

            // Continue with the main logic
        } else {
            console.error('Error:', error);
        }
    }
}

async function getCodeFromUser() {
    return new Promise((resolve) => {
        const readlineInterface = createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        readlineInterface.question('Enter the code from the browser: ', (code) => {
            readlineInterface.close();
            resolve(code);
        });
    });
}

main();

const unsplash = createApi({
    accessKey: 'zvagPzXS9ZjNzVKJYENKAv8llvI0ErOz5mUV3rqb77I',
    fetch: nodeFetch,
    headers: { 'X-Custom-Header': 'foo' },
});

const destinationFileName = 'downloaded_image.jpg';
const destinationPath = path.join('img', destinationFileName);

unsplash.photos.getRandom({
    orientation: 'landscape',
    query: 'nature',
}).then(result => {
    const imageUrl = result['response']['urls']['raw'];
    console.log('random photo', result['response']['urls']['raw']);
    downloadImage(imageUrl, destinationPath)
        .then(() => {
            console.log('Image downloaded successfully.');
        })
        .catch((error) => {
            console.error('Failed to download image:', error.message);
        });
});

async function downloadImage(url, destinationPath) {
    try {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream',
        });

        // Create a writable stream and pipe the image data to it
        const writer = fs.createWriteStream(destinationPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading image:', error.message);
        throw error;
    }
}
