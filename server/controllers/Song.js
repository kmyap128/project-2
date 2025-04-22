const models = require('../models');

const { Song } = models;

const homePage = async (req, res) => res.render('app');

const addSong = async (req, res) => {
    if(!req.body.title || !req.body.artist ){
        return res.status(400).json({ error: 'Title and artist are both required!' });
    }

    const songData = {
        title: req.body.title,
        artist: req.body.artist,
        user: req.session.account._id,
    };

    try {
        const newSong = new Song(songData);
        await newSong.save();
        return res.status(201).json({ title: newSong.title, artist: newSong.artist });
    } catch (err) {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({ error: 'Song already added!' });
        }
        return res.status(500).json({ error: 'An error occured adding the song!'});
    }
};

const getSongs = async (req, res) => {
    try {
        const query = {user: req.session.account._id };
        const docs = await Song.find(query).select('title artist').lean().exec();

        return res.json({ songs: docs });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving songs!'});
    }
};

module.exports = {
    homePage,
    addSong,
    getSongs,
};