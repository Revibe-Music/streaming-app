import Realm from 'realm'
import realm from './../realm';
import Spotify from 'rn-spotify-sdk';
import YouTubeAPI from './../../api/youtube'



export const update = async () => {
    if(Realm.schemaVersion(Realm.defaultPath) == 7) {
      if(realm.objects('Artist').slice(0).filter(x => x.image!=="").map(x => x.image).length !== realm.objects('Artist').slice(0).length) {
        console.log("Running post migration function for realm v7...");

        // ADDING SPOTIFY ARTIST IMAGE TO ARTIST OBJECT
        var spotifySongs = realm.objects('Platform').filtered(`name = "Spotify"`)["0"].songs;
        var artistIds = JSON.parse(JSON.stringify(spotifySongs.slice(0).map(song => song.Artist.id)));
        var artistRawData = []
        var artistsRetreived = 0
        try{
          while(artistIds.length > 0) {
            artistRawData.push(Spotify.getArtists(artistIds.slice(0, 50)))
            artistsRetreived += 50
            artistIds = artistIds.slice(40)
          }
          var artistData = await Promise.all(artistRawData)
          for(var x=0; x<artistData.length; x++) {
            artistData[x] = artistData[x].artists
          }
          artistData = [].concat.apply([], artistData);
          var artists = []
          var name,id,image;
          for(var x=0; x<artistData.length; x++) {
            name = artistData[x]['name'];
            id = artistData[x]['id']
            if(!!artistData[x]['images']) {
              if(artistData[x]['images'].length > 0) {
                image = artistData[x]['images'][artistData[x]['images'].length-1]['url'];
                artists.push({name: name, id: id, image: image});
              }
              else {
                console.log(artistData[x]);
              }
            }
            else {
              console.log(artistData[x]);
            }
          }
          realm.write(() => {
            for (let i = 0; i < artists.length; i++) {
              artist = realm.objects('Artist').filtered(`id = "${artists[i].id}"`)[0];
              artist.image = artists[i].image
            }
          })
        }
        catch(error) {
          console.log(error);
        }


        // ADDING SPOTIFY ARTIST IMAGE TO ARTIST OBJECT
        youtube = new YouTubeAPI()
        var youtubeSongs = realm.objects('Platform').filtered(`name = "YouTube"`)["0"].songs;
        artistIds = JSON.parse(JSON.stringify(youtubeSongs.slice(0).map(song => song.Artist.id)));
        artistRawData = []
        artistsRetreived = 0
        try {
          while(artistIds.length > 0) {
            artistRawData.push(youtube.getChannelImages(artistIds.slice(0, artistsRetreived + 50)))
            artistsRetreived += 50
            artistIds = artistIds.slice(50)
          }
          artistData = await Promise.all(artistRawData)
          artists = [].concat.apply([], artistData);
          realm.write(() => {
            for (let i = 0; i < artists.length; i++) {
              artist = realm.objects('Artist').filtered(`id = "${artists[i].id}"`)[0];
              artist.image = artists[i].image
            }
          })
        }
        catch(error) {
          console.log(error);
        }
      }
    }
};
