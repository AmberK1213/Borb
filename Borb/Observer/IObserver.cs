using src.Models;
public interface IObserver
{
    Task Update(string userId,Message message);
}