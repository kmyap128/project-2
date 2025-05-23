const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getSongs', mid.requiresLogin, controllers.Song.getSongs);
  app.get('/getPlaylists', mid.requiresLogin, controllers.Playlist.getPlaylists);
  app.get('/getPlaylist', mid.requiresLogin, controllers.Playlist.getPlaylistById);
  app.get('/togglePremium', controllers.Account.togglePremium);
  app.get('/getPremiumStatus', controllers.Account.getPremiumStatus);

  app.post('/addSongToPlaylist', mid.requiresLogin, controllers.Playlist.addSongToPlaylist);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/home', mid.requiresLogin, controllers.Song.homePage);
  app.post('/home', mid.requiresLogin, controllers.Song.addSong);

  app.get('/playlist', mid.requiresLogin, controllers.Playlist.homePage);
  app.post('/playlist', mid.requiresLogin, controllers.Playlist.addPlaylist);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
