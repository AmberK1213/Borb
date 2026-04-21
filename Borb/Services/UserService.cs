using MongoDB.Driver;
using src.Models;

public class UserService
{
    private readonly MongoDbService _mongo;

    public UserService(MongoDbService mongo)
    {
        _mongo = mongo;
    }

    public async Task<User> Register(string username, string password)
    {
        var existingUser = await _mongo.Users
            .Find(u => u.Username == username)
            .FirstOrDefaultAsync();
        if (existingUser != null)
        {
            throw new InvalidOperationException("User already exists");
        }
        var user = new User
        {
            Username = username,
            Password = password
        };
        await _mongo.Users.InsertOneAsync(user);
        return user;
    }
    public async Task<User?> Login(string username, string password)
    {
        var user = await _mongo.Users
            .Find(u => u.Username == username && u.Password == password)
            .FirstOrDefaultAsync();
        return user;
    }
}