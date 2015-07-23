# worldstar

Monthly leaderboard view for your Strava club

## Installation
```bash
		npm install
```

* Create an application at [strava.com/developers](http://www.strava.com/developers) and make note of your `access_token`
* from the root of your node application: `$ npm install strava-v3`
* `$ mkdir data`
* `$ cp node_modules/strava-v3/strava_config data/strava_config`
* Open `data/strava_config` in your favorite text editor and supply your applications `access_token` to the `access_token` field

* Input your club's id to the var clubID in angularApp.js

```bash
		npm start
```
