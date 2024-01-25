import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';
import ChromecastAPI from 'chromecast-api';

const client = new ChromecastAPI();

const unsplash = createApi({
    accessKey: 'zvagPzXS9ZjNzVKJYENKAv8llvI0ErOz5mUV3rqb77I',
    fetch: nodeFetch,
});

function run() {
    unsplash.photos.getRandom({
        orientation: 'landscape',
        query: 'nature 4k',
        fit: 'clamp',
    }).then(result => {
        const imageUrl = result['response']['urls']['full'];
        playOnChromecast(imageUrl + '.jpeg', () => {
            // Callback function to be executed after device.play is complete
            setTimeout(() => {
                console.log("hier");
                stopChromecastStream();
                run(); // Trigger the next iteration
            }, 60000); // Adjust the timeout duration as needed
        });
    });

    function playOnChromecast(mediaPath, callback) {
        client.on('device', function (device) {
            device.play(mediaPath, function (err) {
                if (!err) {
                    console.log('Playing on your Chromecast');
                    callback(); // Call the callback once device.play is complete
                }
            });
        });
    }

    function stopChromecastStream() {
        client.on('device', function (device) {
            device.stop(function (err) {
                if (!err) console.log('Stopping Stream');
            });
        });
    }
}

run();
