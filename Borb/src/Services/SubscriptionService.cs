using src.Models;
using MongoDB.Driver;

namespace src.Services;

public class SubscriptionService
{
    private readonly MongoDbService _mongo;
    public SubscriptionService(MongoDbService mongo)
    {
        _mongo = mongo;
    }

    public async Task<Subscription> Subscribe(string userId, string topicId)
    {
        var existing = await _mongo.Subscriptions
            .Find(x => x.UserId == userId && x.TopicId == topicId)
            .FirstOrDefaultAsync();
        if (existing != null) 
            throw new Exception("Already subscribed");
        var sub = new Subscription
        {
            UserId = userId,
            TopicId = topicId
        };

        await _mongo.Subscriptions.InsertOneAsync(sub);
        return sub;
    }
    public async Task Unsubscribe(string userId, string topicId)
    {
        await _mongo.Subscriptions.DeleteOneAsync(
            x => x.UserId == userId && x.TopicId == topicId
            );
    }
    public async Task<List<Subscription>> GetUserSubscriptions(string userId)
    {
        return await _mongo.Subscriptions
            .Find(x => x.UserId == userId)
            .ToListAsync();
    }
}
