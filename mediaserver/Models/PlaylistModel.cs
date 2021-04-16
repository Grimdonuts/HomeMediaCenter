using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace mediaserver.Models
{
    public class PlaylistModel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string playlistname { get; set; }
        public List<string> videos { get; set; }
        public int __v { get; set; }
    }
}

