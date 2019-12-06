/*
* This file contains the schema used on version db verision 7.
* Version 7 is the 2nd version put into production and the first
* version that requires migrations
*/

import Spotify from 'rn-spotify-sdk';
import YouTubeAPI from './../../api/youtube'
import { IP } from './../../config'


export const Profile = {
  name: "Profile",
  properties: {
    firstName: "string?",
    lastName: "string?",
    username: "string",
    email: "string",
  }
};

// export const PlatformSchema = {
//   name: "Platform",
//   properties: {
//     name: "string",
//     credentials: "Credential?",
//   }
// };

export const CredentialSchema = {
  name: "Credential",
  properties: {
    platform: "string",
    accessToken:  'string',
    secretToken:  'string?',
    tokenExpiry:  "string?",
  }
};

export const LibrarySchema = {
  name: "Library",
  properties: {
    platform: "string",
    songs: "Song[]",
  }
};

export const PlaylistSchema = {
  name: "Playlist",
  properties: {
    name: "string",
    songs: "Song[]",
  }
};

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

export const ArtistSchema = {
  name: "Artist",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    imageLowResolution: "string",
    imageMediumResolution: "string",
    imageHighResolution: "string",
  }
};

export const AlbumSchema = {
  name: "Album",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    imageLowResolution: "string",
    imageMediumResolution: "string",
    imageHighResolution: "string",
  }
};
