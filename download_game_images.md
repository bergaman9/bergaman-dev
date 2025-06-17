# Game and Movie Image Downloader

This script downloads game and movie cover images that are used in the recommendations section of the website.

## Usage

Run the script using:

```bash
npm run download-images
```

## What it does

The script downloads images for:

- 16 game images from Steam
- 5 movie images from IMDB

It creates the necessary directories in `public/images/games` and `public/images/movies` if they don't exist, and saves the images there with appropriate filenames.

## Customization

To add more images to be downloaded, edit the `gamesToDownload` and `moviesToDownload` arrays in the `scripts/download-game-images.js` file.

Each entry should have a `name` (used for the filename) and a `url` to download from:

```js
{ name: 'game-name', url: 'https://example.com/image.jpg' }
```

## Error Handling

- The script skips any image that already exists in the target directory
- It catches and reports download errors for individual images
- It continues with the next image if one fails to download

## Requirements

This script requires the `axios` package, which is included in the project dependencies. 