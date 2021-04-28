const mongoose = require('mongoose');

const PlaylistSchema = mongoose.Schema({
	playlistname: String,
	videos: Array
});

module.exports.Playlists = mongoose.model('Playlists', PlaylistSchema);