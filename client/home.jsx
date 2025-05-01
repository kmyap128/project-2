const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleSong = (e, onSongAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#songTitle').value;
    const artist = e.target.querySelector('#songArtist').value;

    if(!title || !artist ) {
        helper.handleError('All fields are required');
        return false;
    }

    console.log('submitted');
    helper.sendPost(e.target.action, {title, artist}, onSongAdded);
    return false;
};

const handlePlaylist = (e, onPlaylistAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#playlistName').value;

    if (!name) {
        helper.handleError('Playlist name required');
        return false;
    }
    console.log('submitted');
    helper.sendPost(e.target.action, {name}, onPlaylistAdded);
    return false;
}

const SongWindow = (props) => {
    return(
        <form id='SongWindow'
            onSubmit={(e) => handleSong(e, props.triggerReload)}
            name='SongWindow'
            action='/home'
            method='POST'
            className='SongWindow'
        >
            <div id='songBox'>
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" id="songTitle" placeholder='Song Title' />
                <label htmlFor="artist">Artist: </label>
                <input type="text" name="artist" id="songArtist" placeholder='Song Artist' />
                <input type="submit" className='addSongSubmit' value='Add Song' />
            </div>
        </form>
    );
};

const PlaylistWindow = (props) => {
    return(
        <form id='PlaylistWindow'
            onSubmit={(e) => handlePlaylist(e, props.triggerReload)}
            name='PlaylistWindow'
            action='/playlist'
            method='POST'
            className='PlaylistWindow'
        >
            <div id='playlistBox'>
                <label htmlFor="name">Name: </label>
                <input type="text" name="name" id="playlistName" placeholder='Playlist Name' />
                <input type="submit" className='addPlaylistSubmit' value='Add Playlist' />
            </div>
        </form>
    );
};

const SongList = (props) => {
    const [songs, setSongs] = useState(props.songs);

    useEffect(() => {
        const loadSongsFromServer = async () => {
            const response = await fetch('/getSongs');
            const data = await response.json();
            setSongs(data.songs);
        };
        loadSongsFromServer();
    }, [props.reloadSongs]);

    if(songs.length === 0) {
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    const songNodes = songs.map(song => {
        return (
            <div key={song._id} className='song'>
                <img src="/assets/img/logo.png" alt="Songify logo" className='songIcon' />
                <h3 className='songTitle'>Title: {song.title}</h3>
                <h3 className='songArtist'>Artist: {song.artist}</h3>
            </div>
        );
    });

    return (
        <div className='songList'>
            {songNodes}
        </div>
    );
};

const PlaylistList = (props) => {
    const [playlists, setPlaylists] = useState(props.playlists);

    useEffect(() => {
        const loadPlaylistsFromServer = async () => {
            const response = await fetch('/getPlaylists');
            const data = await response.json();
            setPlaylists(data.playlists);
        };
        loadPlaylistsFromServer();
    }, [props.reloadPlaylists]);

    if(playlists.length === 0) {
        return (
            <div className='playlistList'>
                <h3 className='emptyPlaylist'>No Playlists Yet!</h3>
            </div>
        );
    }

    const playlistNodes = playlists.map(playlist => {
        return (
            <div key={playlist._id} className='playlist' onClick={() => props.openPlaylistEditor(playlist._id)}>
                <img src="/assets/img/logo.png" alt="Songify logo" className='songIcon' />
                <h3 className='playlistName'>Name: {playlist.name}</h3>
            </div>
        );
    });

    return (
        <div className='playlistList'>
            {playlistNodes}
        </div>
    );
};

const SongApp = () =>{
    const [reloadSongs, setReloadSongs] = useState(false);

    return (
        <div id='songPage'>
            <div id='addSong'>
                <SongWindow triggerReload={() => setReloadSongs(!reloadSongs)} />
            </div>
            <div id='songs'>
                <SongList songs={[]} reloadSongs={reloadSongs} />
            </div>
        </div>
    );
};

const PlaylistApp = ( { openPlaylistEditor } ) => {
    const [reloadPlaylists, setReloadPlaylists] = useState(false);

    return (
        <div id='playlistPage'>
            <div id='addPlaylist'>
                <PlaylistWindow triggerReload={() => setReloadPlaylists(!reloadPlaylists)} />
            </div>
            <div id='playlists'>
                <PlaylistList playlists={[]} reloadPlaylists={reloadPlaylists} openPlaylistEditor={openPlaylistEditor}/>
            </div>
        </div>
    );
}

const EditPlaylistApp = ({ playlistId }) => {
    const [playlist, setPlaylist] = useState(null);
    const [allSongs, setAllSongs] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [reloadPlaylist, setReloadPlaylist] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playlistRes = await fetch(`/getPlaylist?id=${playlistId}`);
                const playlistData = await playlistRes.json();
                setPlaylist(playlistData.playlist);
    
                const songRes = await fetch('/getSongs');
                const songData = await songRes.json();
                setAllSongs(songData.songs);
    
                setLoading(false); 
            } catch (err) {
                console.error('Error fetching data:', err);
                setLoading(false); 
            }
        };
        fetchData();
    }, [playlistId, reloadPlaylist]);

    const handleAddSong = async (songId) => {
        await fetch('/addSongToPlaylist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlistId, songId }),
        });

        setReloadPlaylist(prev => !prev);

        const res = await fetch(`/getPlaylist?id=${playlistId}`);
        const data = await res.json();
        setPlaylist(data.playlist);
    };

    if (loading) return <div>Loading playlist...</div>;

    const songsInPlaylist = playlist && Array.isArray(playlist.songs) ? playlist.songs : [];

    console.log(songsInPlaylist.length);

    return (
        <div id='editWindow'>
            <h2>Editing Playlist: {playlist.name}</h2>
            <h3>Songs in Playlist:</h3>
            {songsInPlaylist.length === 0 ? (
                <p className="emptySong">No songs in this playlist yet!</p>
            ) : (
                <div className='editSongList'>
                    {songsInPlaylist.map(song => (
                        <div key={song._id} className='song'>
                            <img src="/assets/img/logo.png" alt="Songify logo" className='songIcon' />
                            <h3 className='songTitle'>Title: {song.title}</h3>
                            <h3 className='songArtist'>Artist: {song.artist}</h3>
                        </div>
                    ))}
                </div>
            )}

            <h3>Add Songs:</h3>
            {allSongs.length === 0 ? (
                <p className="emptySong">No available songs to add.</p>
            ) : (
                <div className='addSongList'>
                    {allSongs.map(song => (
                        <div key={song._id} className='song'>
                            {song.title} - {song.artist}
                            <button onClick={() => handleAddSong(song._id)} id='addButton'>Add</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


const init = () => {
    const homeButton = document.getElementById('homeButton');
    const playlistButton = document.getElementById('playlistButton');

    const root = createRoot(document.getElementById('app'));

    const renderEditPlaylist = (playlistId) => {
        root.render(<EditPlaylistApp playlistId={playlistId} />);
    };

    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <SongApp />);
        return false;
    });
    
    playlistButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <PlaylistApp openPlaylistEditor={renderEditPlaylist} /> );
    });

    root.render( <SongApp />);
};

window.onload = init;