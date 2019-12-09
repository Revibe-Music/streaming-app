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
    tokens: "Credential[]"
  }
};

// will store Revibe, Spotify, and youtube tokens
export const TokenSchema = {
  name: "Credential",
  properties: {
    platform: "string",
    accessToken:  'string',
    secretToken:  'string?',
    tokenExpiry:  "float?",
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
    uri: "string",
    title: "string",
    Contributors: "Contributor[]",
    Album: "Album?",
    dateSaved: "date?",
    duration: "int?",
    platform: "string",
  }
};

// id
// uri
// file
// title
// album
// duration
// platform
// contributors
// uploaded_by
// uploaded_date
// genre
// is_displayed
// is_deleted

export const AlbumSchema = {
  name: "Album",
  properties: {
    Contributors: "Contributor[]",
    name: "string",
    id: "string", // could be artist of channel
    uri: "string",
    images: "Image[]"
  }
};

export const ArtistSchema = {
  name: "Artist",
  properties: {
    name: "string",
    id: "string", // could be artist of channel
    uri: "string",
    images: "Image[]"
  }
};

export const ContributorSchema = {
  name: "Contributor",
  properties: {
    contributionType: {type: "string", default: "Artist"},
    artist: "Artist",
  }
};

export const ImageSchema = {
  name: "Image",
  properties: {
    url: "string",
    resolution: "string",
  }
};
