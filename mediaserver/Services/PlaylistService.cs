using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using mediaserver.Models;
using MongoDB.Driver;

namespace mediaserver.Services
{
    public class PlaylistService
    {
        private readonly IMongoCollection<PlaylistModel> _playlists;

        public PlaylistService(IPlaylistSettings settings)
        {
            MongoInternalIdentity internalIdentity = new MongoInternalIdentity("mediaserver", settings.UserName);
            PasswordEvidence passwordEvidence = new PasswordEvidence(settings.Password);
            MongoCredential mongoCredential = new MongoCredential(settings.MongoDbAuthMechanism, internalIdentity, passwordEvidence);
            MongoClientSettings settings2 = new MongoClientSettings();
            settings2.Credential = mongoCredential;
            MongoServerAddress address = new MongoServerAddress(settings.Server);
            settings2.Server = address;
            MongoClient client = new MongoClient(settings2);
            var mongoServer = client.GetDatabase(settings.DatabaseName);
            _playlists = mongoServer.GetCollection<PlaylistModel>(settings.PlaylistsCollectionName);
        }

        public List<PlaylistModel> Get() =>
            _playlists.Find(playlist => true).ToList();

        public PlaylistModel Get(string id) =>
            _playlists.Find(playlist => playlist.Id == id).FirstOrDefault();

        public PlaylistModel Create(PlaylistModel playlist)
        {
            _playlists.InsertOne(playlist);
            return playlist;
        }

        public void Update(string id, PlaylistModel playlistIn) =>
            _playlists.ReplaceOne(playlist => playlist.Id == id, playlistIn);

        public void Remove(PlaylistModel playlistIn) =>
            _playlists.DeleteOne(playlist => playlist.Id == playlistIn.Id);

        public void Remove(string id) =>
            _playlists.DeleteOne(playlist => playlist.Id == id);
    }
}
