using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace src.Models;
public class Topic
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string CreatedBy { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int ViewCount { get; set; } = 0;
}
