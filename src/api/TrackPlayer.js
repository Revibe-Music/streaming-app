import RNTrackPlayer, { Track } from 'react-native-track-player'

class TrackPlayer {
    /** A wrapper API around RNTrackPlayer
     *
     * This API simplifies using RNTrackPlayer by exposing methods to do common things.
     */

    // this allows us to get a current instance, or make an instance of the player
    // and stops us reinitialising the player
    static instance: TrackPlayer

    static getInstance() {
        if (!this.instance) {
            this.instance = new TrackPlayer()
            this.instance.init()
            this.instance.init()
            return this.instance
        }
        return this.instance
    }

    init() {
        // set up the player so we can use it
        // RNTrackPlayer.setupPlayer()
        RNTrackPlayer.reset()

        // add support for capabilities
        const capabilities = [
          RNTrackPlayer.CAPABILITY_PLAY,
          RNTrackPlayer.CAPABILITY_PAUSE,
          RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          RNTrackPlayer.CAPABILITY_STOP
        ]

        // list of options for the player
        const options = {
          capabilities: [
            RNTrackPlayer.CAPABILITY_PLAY,
            RNTrackPlayer.CAPABILITY_PAUSE,
            RNTrackPlayer.CAPABILITY_SEEK_TO,
            RNTrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            RNTrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          ],
        }

        // update the options
        RNTrackPlayer.setupPlayer()
          .then(() => RNTrackPlayer.updateOptions(options))
    }

    async play(song) {
      const image = song.album.images.reduce(function(prev, curr) {
          return prev.height < curr.height ? prev : curr;
      });

      await RNTrackPlayer.add({
          id: song.id,
          url: `https://revibe-media.s3.amazonaws.com/media/audio/songs/${song.uri}/outputs/mp4/medium.mp4`,
          title: song.name,
          // duration: song.duration,
          duration: 200,
          artist: song.contributors['0'].artist.name,
          album: song.platform !== "YouTube"? song.album.name : "YouTube",
          artwork: image.url, // URL or RN's image require()
      })
      let tracks = await RNTrackPlayer.getQueue();
      if(tracks.length > 1) {
        RNTrackPlayer.skipToNext();
      }
      else {
        RNTrackPlayer.play();
      }
    }

    pause() {
      RNTrackPlayer.pause()
    }

    resume() {
      RNTrackPlayer.play()
    }

    async getPosition() {
      return parseFloat(await RNTrackPlayer.getPosition())
    }

    async getDuration() {
      return parseFloat(await RNTrackPlayer.getDuration())
    }

    seek(time) {
      RNTrackPlayer.seekTo(time)
    }
}

export default TrackPlayer
