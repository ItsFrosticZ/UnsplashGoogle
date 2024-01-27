
# Google Chromecast Custom Ambient Mode with Unsplash Photos

## Overview

This Node.js project utilizes the Unsplash API to create a personalized ambient mode for Google Chromecast, offering a more visually appealing experience than the default ambient mode photos. The script fetches random high-quality nature photos from Unsplash and plays them on your Chromecast device.

## Prerequisites

Ensure that the following prerequisites are installed on your machine:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/ItsFrosticZ/UnsplashGoogle.git
```

2. **Navigate to the project directory:**

```bash
cd UnsplashGoogle
```

3. **Install dependencies:**
```bash
npm install unsplash-js
npm install node-fetch
npm install chromecast-api
```

## Configuration

Update the `accessKey` in the `unsplash.createApi` function with your own Unsplash access key. You can obtain it by creating an account on the [Unsplash Developer](https://unsplash.com/developers) platform.

```bash
const unsplash = createApi({
    accessKey: 'YOUR_UNSPLASH_ACCESS_KEY',
    fetch: nodeFetch,
});
```

## Usage

Run the script to initiate the custom ambient mode on your Chromecast device:

```bash
node app.js
```

The script fetches a random nature photo from Unsplash, plays it on your Chromecast, and repeats the process every 60 seconds. Adjust the timeout duration in the script as needed.

To customize the type of photo, modify the `query` parameter in the `getRandom` function. For example, change `'nature 4k'` to `'cityscape'` or any other desired query.

```bash
unsplash.photos.getRandom({
    orientation: 'landscape',
    query: 'cityscape',
    fit: 'clamp',
}).then(result => {
    // ...
});
```

## Note
Ensure that your Chromecast device is on the same network as the machine running the script.

## Acknowledgments
- [Unsplash](https://unsplash.com/) for providing a vast collection of high-quality photos.
- [ChromecastAPI](https://www.npmjs.com/package/chromecast-api) for the Chromecast integration.
- [node-fetch](https://www.npmjs.com/package/node-fetch) for making HTTP requests in Node.js.
- [unsplash-js](https://www.npmjs.com/package/unsplash-js) for making the photo requests in Node.js.