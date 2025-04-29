const models = require('../models');

const { Playlist } = models;

const homePage = async (req, res) => res.render('app');

// Controller to create an empty playlist
const addPlaylist = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Playlist name is required!' });
  }

  const playlistData = {
    name: req.body.name,
    songs: [], // empty at creation
    user: req.session.account._id,
  };

  try {
    const newPlaylist = new Playlist(playlistData);
    await newPlaylist.save();
    return res.status(201).json({ name: newPlaylist.name, id: newPlaylist._id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occurred creating the playlist!' });
  }
};

// Controller to add a song to an existing playlist
const addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.body;

  if (!playlistId || !songId) {
    return res.status(400).json({ error: 'Playlist ID and Song ID are required!' });
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found!' });
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    return res.status(200).json({ message: 'Song added to playlist!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error adding song to playlist!' });
  }
};

// Controller to get all playlists for the logged-in user
const getPlaylists = async (req, res) => {
  try {
    const query = { user: req.session.account._id };
    const docs = await Playlist.find(query)
      .select('name songs') // Select only name and songs array
      .populate('songs', 'title artist') // Populate song details (optional)
      .lean()
      .exec();

    return res.json({ playlists: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving playlists!' });
  }
};

module.exports = {
  homePage,
  addPlaylist,
  addSongToPlaylist,
  getPlaylists,
};
