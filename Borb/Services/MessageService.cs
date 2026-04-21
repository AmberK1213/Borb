using src.Models;
using MongoDB.Driver;
namespace src.Services;

public class MessageService
{
    private readonly IMongoCollection<Message> _messages;
    private readonly TopicNotifier _notifier;
    public MessageService(IConfiguration config, TopicNotifier notifier)
    {
        var client = new MongoClient(config["MongoDbSettings:ConnectionString"]);
        var database = client.GetDatabase(config["MongoDbSettings:DatabaseName"]);

        _messages = database.GetCollection<Message>("Messages");
        _notifier = notifier;

    }
    public async Task<List<Message>> GetByTopicId(string topicId)
    {
        return await _messages
            .Find(m => m.TopicId == topicId)
            .ToListAsync();
    }

    public async Task Create(Message message)
    {
        message.CreatedAt = DateTime.UtcNow;
        await _messages.InsertOneAsync(message);

       await _notifier.Notify(message);
    }




}
