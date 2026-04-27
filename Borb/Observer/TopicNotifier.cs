using src.Models;
using src.Services;

public class TopicNotifier
{
    private readonly SubscriptionService _subscriptionService;

    public TopicNotifier(SubscriptionService subscriptionService)
    {
        _subscriptionService = subscriptionService;
    }

    private List<IObserver> _observers = new();
    public void Subscribe(IObserver observer)
    {
        _observers.Add(observer);
    }

    public void Unsubscribe(IObserver observer)
    {
        _observers.Remove(observer);
    }

    public async Task Notify(Message message)
    {
        var subscribers = await _subscriptionService.GetByTopicId(message.TopicId);
        foreach(var sub in subscribers)
        {
            foreach(var observer in _observers)
            {
                await observer.Update(sub.UserId, message);
            }
        }
    }
}