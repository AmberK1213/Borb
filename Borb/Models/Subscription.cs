using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace src.Models;
public class Subscription
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public string TopicId { get; set; } = null!;
}
