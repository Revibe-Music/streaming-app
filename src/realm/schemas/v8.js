/*
* This file contains the schema used on version db verision 7.
* Version 7 is the 2nd version put into production and the first
* version that requires migrations
*/

export const Profile = {
  name: "Profile",
  properties: {
    firstName: "string?",
    lastName: "string?",
    username: "string",
    email: "string",
    tokens: "Token[]",
    birthday: "date?",
    country: "string?"
  }
};

// will store Revibe, Spotify, and youtube tokens
export const TokenSchema = {
  name: "Token",
  properties: {
    platform: "string",
    accessToken:  'string',
    refreshToken:  'string?',
    tokenExpiry:  "float?",
  }
};

export const SongSchema = {
  name: "Song",
  properties: {
    id: "string", // this may be the same as uri for youtube
    uri: "string",
    file: "string?",
    name: "string",
    album: "Album?",
    contributors: "Contributor[]",
    duration: "int?",
    platform: "string",
    uploaded_date: "date"
  }
};

export const AlbumSchema = {
  name: "Album",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    uri: "string",
    images: "Image[]",
    contributors: "Contributor[]",
    type: "string",
    platform: "string",
    uploaded_date: "date"
  }
};

export const ArtistSchema = {
  name: "Artist",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    uri: "string",
    images: "Image[]",
    platform: "string",
  }
};

export const ContributorSchema = {
  name: "Contributor",
  properties: {
    contributionType: {type: "string", default: "Artist"},
    artist: "Artist",
  }
};

export const LibrarySchema = {
  name: "Library",
  properties: {
    platform: "string",
    songs: "SavedSong[]",
  }
};

export const PlaylistSchema = {
  name: "Playlist",
  properties: {
    name: "string",
    songs: "SavedSong[]",
  }
};

export const SavedSongSchema = {
  name: "SavedSong",
  properties: {
    song: "Song",
    dateSaved: "date?",
  }
};

export const ImageSchema = {
  name: "Image",
  properties: {
    url: "string",
    height: "number",
    width: "number",
  }
};
