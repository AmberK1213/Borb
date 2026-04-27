using MongoDB.Driver;
using src.Models;

public class NotificationService
{
    private readonly MongoDbService _mongo;

    public NotificationService(MongoDbService mongo)
    {
        _mongo = mongo;
    }

    public async Task<Notification> Create(string userId, Message message)
    {
        var notification = new Notification
        {
            UserId = userId,
            TopicId = message.TopicId,
            Message = message.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _mongo.Notifications.InsertOneAsync(notification);
        return notification;
    }
    public async Task<List<Notification>> GetByUser(string userId)
    {
        return await _mongo.Notifications
            .Find(x => x.UserId == userId)
            .SortBy(x => x.CreatedAt)
            .ToListAsync();
    }
}
