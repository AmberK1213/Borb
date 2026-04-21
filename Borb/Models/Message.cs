using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace src.Models;
public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; } 
    public string TopicId { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}

