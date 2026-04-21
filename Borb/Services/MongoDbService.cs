using MongoDB.Driver;
using src.Models;


public class MongoDbService
{
    private readonly IMongoDatabase _database;
    public MongoDbService(IConfiguration config)
    {
        var client = new MongoClient(
            config["MongoDbSettings:ConnectionString"]
            );
        _database = client.GetDatabase(
            config["MongoDbSettings:DatabaseName"]
            );
     
    }

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("Users");
    public IMongoCollection<Topic> Topics =>
        _database.GetCollection<Topic>("Topics");
    public IMongoCollection<Subscription> Subscriptions =>
        _database.GetCollection<Subscription>("Subscriptions");

    public IMongoCollection<Message> Messages =>
        _database.GetCollection<Message>("Messages");

    public IMongoCollection<Notification> Notifications =>
        _database.GetCollection<Notification>("Notifications");
}