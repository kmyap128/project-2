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
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" id="songTitle" placeholder='Song Title' />
            <label htmlFor="artist">Artist: </label>
            <input type="text" name="artist" id="songArtist" placeholder='Song Artist' />
            <input type="submit" className='addSongSubmit' value='Add Song' />
        </form>
    );
};

const PlaylistWindow = (props => {
    return(
        <form id='PlaylistWindow'
            onSubmit={(e) => handlePlaylist(e, props.triggerReload)}
            name='PlaylistWindow'
            action='/home'
            method='POST'
            className='PlaylistWindow'
        >
            <label htmlFor="name">Name: </label>
            <input type="text" name="name" id="playlistName" placeholder='Playlist Name' />
            <input type="submit" className='addPlaylistSubmit' value='Add Playlist' />
        </form>
    );
})

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
            <div key={song.id} className='song'>
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

const App = () =>{
    const [reloadSongs, setReloadSongs] = useState(false);

    return (
        <div>
            <div id='addSong'>
                <SongWindow triggerReload={() => setReloadSongs(!reloadSongs)} />
            </div>
            <div id='songs'>
                <SongList songs={[]} reloadSongs={reloadSongs} />
            </div>
        </div>
    );
};

const init = () => {
    const homeButton = document.getElementById('homeButton');
    const playlistButton = document.getElementById('playlistButton');

    const root = createRoot(document.getElementById('app'));

    homeButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <App />);
        return false;
    });
    
    playlistButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render( <PlaylistWindow /> );
    });

    root.render( <App />);
};

window.onload = init;