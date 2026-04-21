using MongoDB.Driver;
using src.Models;

public class TopicService
{
    private readonly MongoDbService _mongo;
    public TopicService(MongoDbService mongo)
    {
        _mongo = mongo;
    }

    public async Task<Topic> CreateTopic(string title, string userId)
    {
        var topic = new Topic
        {
            Title = title,
            CreatedBy = userId,
            CreatedAt = DateTime.UtcNow
        };
        await _mongo.Topics.InsertOneAsync(topic);
        return topic;
    }

    public async Task<List<Topic>> GetAllTopics()
    {
        return await _mongo.Topics.Find(_ => true)
            .ToListAsync();
    }

}