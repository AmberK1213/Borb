using Microsoft.AspNetCore.SignalR;
using src.Models;

public class UserObserver : IObserver
{
    private readonly NotificationService _notificationService;
    private readonly IHubContext<NotificationHub> _hubContext;

    public UserObserver(NotificationService notificationService, IHubContext<NotificationHub> hubContext)
    {
        _notificationService = notificationService;
        _hubContext = hubContext;
    }

    public async Task Update(string userId, Message message)
    {
        var notification = await _notificationService.Create(userId, message);
        await _hubContext.Clients.Group(userId).SendAsync("NotificationReceived", notification);
    }
}
