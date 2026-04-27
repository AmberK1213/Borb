using MongoDB.Driver;
using src.Models;
using src.Services;


public class TopicService
{
    private readonly MongoDbService _mongo;
    private readonly SubscriptionService _subscriptionService;

    public TopicService(MongoDbService mongo, SubscriptionService subscriptionService)
    {
        _mongo = mongo;
        _subscriptionService = subscriptionService;
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
        await _subscriptionService.Subscribe(userId, topic.Id);
      
        return topic;
    }

        public async Task IncrementViewCount(string id)
    {
        var filter = Builders<Topic>.Filter.Eq(t => t.Id, id);
        var update = Builders<Topic>.Update.Inc(t => t.ViewCount, 1);
        await _mongo.Topics.UpdateOneAsync(filter, update);
    }

    public async Task<List<Topic>> GetAllTopics()
    {
        return await _mongo.Topics.Find(_ => true)
            .ToListAsync();
    }

    public async Task<Topic> GetTopicById(string id)
    {
        return await _mongo.Topics.Find(t => t.Id == id).FirstOrDefaultAsync();
    }

}