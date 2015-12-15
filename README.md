Earth Live JS
=======

A NodeJS re-authored of [EarthLiveSharp](https://github.com/bitdust/EarthLiveSharp).

Fetch photo of the earth every 5 minutes from [himawari-8](http://himawari8.nict.go.jp/) ([wiki](https://en.wikipedia.org/wiki/Himawari_8)).

## Installation

1.  Clone this repository

    ```sh
    git clone https://github.com/xingrz/earthlivejs.git
    cd earthlivejs
    ```

2.  Install necessary libraries for `node-canvas` as describe [here](https://github.com/Automattic/node-canvas#installation)

3.  Install dependencies and start

    ```sh
    npm install
    npm start
    ```

4.  Set the `images` folder as your wallpaper slides switches every 5 minutes.

Keep the script running, it will fetches the latest image every 5 minutes and cleans outdated images.

You can also use something like [forever](https://github.com/foreverjs/forever) or [pm2](http://pm2.keymetrics.io) to run the script in the background.

## License

[MIT License](LICENSE)
