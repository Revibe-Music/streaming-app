/*
* This file contains the schema used on version db verision 6.
* Version 6 is the initial version put into production.
*/

export const PlatformSchema = {
  name: "Platform",
  properties: {
    name: "string",
    credentials: "Credential?",
    songs: "Song[]"
  }
};

export const CredentialSchema = {
  name: "Credential",
  properties: {
    accessToken:  'string',
    secretToken:  'string?',
    tokenExpiry:  "string?",
  }
};

export const SongSchema = {
  name: "Song",
  primaryKey: "songID",
  properties: {
    songID: "string", // this may be the same as uri for youtube
    name: "string",
    artist: "string",
    artistUri: "string", // could be artist of channel
    album: "string?",
    albumUri: "string?",
    albumArt: "string",
    uri: "string",
    dateSaved: "date?",
    duration: "int?",
  }
};
