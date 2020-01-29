/*
* This file contains the schema used on version db verision 7.
* Version 7 is the 2nd version put into production and the first
* version that requires migrations
*/

import Spotify from 'rn-spotify-sdk';
import YouTubeAPI from './../../api/youtube'
import { IP } from './../../config'



// No change from v6
export const PlatformSchema = {
  name: "Platform",
  properties: {
    name: "string",
    credentials: "Credential?",
    songs: "Song[]"
  }
};

// No change from v6
export const CredentialSchema = {
  name: "Credential",
  properties: {
    accessToken:  'string',
    secretToken:  'string?',
    tokenExpiry:  "string?",
  }
};

// Point to album and artist objects rather
// than saving that data in song object and
// save name of platform
export const SongSchema = {
  name: "Song",
  properties: {
    id: "string", // this may be the same as uri for youtube
    name: "string",
    uri: "string",
    Artist: "Artist?",
    Album: "Album?",
    dateSaved: "date?",
    duration: "int?",
    platform: "string",
  }
};

// New object
export const ArtistSchema = {
  name: "Artist",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    image: "string",
  }
};

// New object
export const AlbumSchema = {
  name: "Album",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    image: "string",
  }
};

export const migrate = (oldRealm, newRealm) => {

  // Spotify migrations
  var oldSongs = oldRealm.objects('Song');
  var newSongs = newRealm.objects('Song');

  var spotifySongsIds = oldRealm.objects('Platform').filtered(`name = "Spotify"`)["0"].songs.slice(0).map(song => song.songID);
  console.log(spotifySongsIds);
  var youtubeSongsIds = oldRealm.objects('Platform').filtered(`name = "YouTube"`)["0"].songs.slice(0).map(song => song.songID);

  // loop through all objects and set the name property in the new schema
  var artist, album;
  for (let i = 0; i < oldSongs.length; i++) {

    if(newRealm.objects('Artist').filtered(`id = "${oldSongs[i].artistUri}"`).slice(0).length < 1) {
      artist = newRealm.create('Artist', {name: oldSongs[i].artist, id: oldSongs[i].artistUri, image: ""});
    }
    else {
      artist = newRealm.objects('Artist').filtered(`id = "${oldSongs[i].artistUri}"`)[0];
    }

    if(newRealm.objects('Album').filtered(`image = "${oldSongs[i].albumArt}"`).slice(0).length < 1) {
        var albumName = oldSongs[i].album ? oldSongs[i].album : ""
        var albumUri = oldSongs[i].albumUri ? oldSongs[i].albumUri : ""
        var albumArt = oldSongs[i].albumArt ? oldSongs[i].albumArt : ""
        album = newRealm.create('Album', { name : albumName, id: albumUri, image: albumArt});
    }
    else {
      album = newRealm.objects('Album').filtered(`image = "${oldSongs[i].albumArt}"`)[0];
    }

    newSongs[i].id = oldSongs[i].songID
    newSongs[i].platform = spotifySongsIds.includes(oldSongs[i].songID) ? "Spotify" : "YouTube"
    newSongs[i].Artist = artist
    newSongs[i].Album = album

    album = null
    artist = null
  }
}
