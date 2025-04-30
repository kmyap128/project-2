const models = require('../models');
const { Playlist } = models;

const homePage = async (req, res) => res.render('app');


const addPlaylist = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Playlist name is required!' });
  }

  const playlistData = {
    name: req.body.name,
    songs: [],
    owner: req.session.account._id, 
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


const addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.body;

  if (!playlistId || !songId) {
    return res.status(400).json({ error: 'Playlist ID and Song ID are required!' });
  }

  try {
    const playlist = await Playlist.findOne({
      _id: playlistId,
      owner: req.session.account._id, 
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found or you do not have access!' });
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

const getPlaylists = async (req, res) => {
  try {
    const query = { owner: req.session.account._id }; 
    const docs = await Playlist.find(query)
      .select('name songs')
      .populate('songs', 'title artist') 
      .lean()
      .exec();

    return res.json({ playlists: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving playlists!' });
  }
};

const getPlaylistById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Playlist ID is required!' });
  }

  try {
    const playlist = await Playlist.findOne({
      _id: id,
      owner: req.session.account._id,
    }).populate('songs', 'title artist').lean();

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found!' });
    }

    return res.json({ playlist });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error fetching playlist!' });
  }
};

module.exports = {
  homePage,
  addPlaylist,
  addSongToPlaylist,
  getPlaylists,
  getPlaylistById, 
};
