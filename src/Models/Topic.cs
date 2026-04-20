using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace src.Models;

public class Topic
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string CreatedBy { get; set; } 
    public DateTime CreatedAt { get; set; }
    public int ViewCount { get; set; }
}