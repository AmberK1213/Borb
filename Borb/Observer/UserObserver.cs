using src.Models;

public class UserObserver : IObserver
{
    private readonly NotificationService _notificationService;

    public UserObserver(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task Update(string userId, Message message)
    {
        await _notificationService.Create(userId, message);
    }
}

