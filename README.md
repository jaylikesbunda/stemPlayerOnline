# Stem Player Online
An online stem player. Inspired by but not affiliated with YEEZY TECH X KANO Stem Player.

https://stemplayeronline.com

See [the project board](https://github.com/lukew3/stemPlayerOnline/projects/1) to see what features are coming up next.

## Usage
This site aims to function as closely to the original stem player device as possible. All usage instructions unique to the site are listed below.

### Loading local files
If you have local stem files that you would like to load into the stem player, you can do so by clicking on the folder icon in the top left corner of the page and selecting the folder. Folders should contain 4 audio files, ideally named 1-4 with a typical audio format type such as .mp3, .flac, .wav. If files are not named by numbers 1-4, they will still play fine, but their positions on the player may be unpredictable.


### Keyboard shortcuts
Keyboard shortcuts have been included to help better the experience of using the stem player on a pc. They simply allow an alternative way of interacting with the stem player other than touching with the mouse.

* `Spacebar` - Presses the center button
* `<Arrowkey>`
  * Standard mode - 
    * Just arrows - Each arrow key increases the volume of it's respective slider.
    * `Ctrl+Arrow` - Each arrow key decreases the volume of it's respective slider.
    * `Shift+Arrow` - Isolates the stem of it's respective slider
  * Loop mode - Left/right Controls the playback speed, Up/down controls the loop duration
* `q` - Presses the menu button
* `a` - Presses the minus button
* `s` - Presses the plus button
* `z` - Presses the left dot button
* `x` - Presses the right dot button

## Developer Setup
1. Clone the repo
2. Start the app by running a local http server with 
```
python -m http.server
```
3. Navigate to the url http://localhost:8000 or the url set by the python server
4. You can use the player by uploading your own tracks by using the folder button in the top left.

Don't edit the `index.html` file directly. Edit `index.pug` and then run `pug index.pug` to generate the `index.html` file. Note that you must have pug installed first, which you can do by running `npm i -g pug-cli`.
