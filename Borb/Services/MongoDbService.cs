using MongoDB.Driver;
using src.Models;
using Microsoft.Extensions.Options;
using System.Security.Cryptography.X509Certificates;


public class MongoDbService
{
    private readonly IMongoDatabase _database;
    public MongoDbService(IOptions<MongoDbSettings> settings)
    {
        var mongoSettings = settings.Value;

        var client = new MongoClient(mongoSettings.ConnectionString);
        _database = client.GetDatabase(mongoSettings.DatabaseName);

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