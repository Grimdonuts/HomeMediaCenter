using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace mediaserver.Models
{
    public class PlaylistSettings : IPlaylistSettings
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string MongoDbAuthMechanism { get; set; }
        public string PlaylistsCollectionName { get; set; }
        public string Server { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IPlaylistSettings
    {
        string UserName { get; set; }
        string Password { get; set; }
        string MongoDbAuthMechanism { get; set; }
        string PlaylistsCollectionName { get; set; }
        string Server { get; set; }
        string DatabaseName { get; set; }
    }
}
