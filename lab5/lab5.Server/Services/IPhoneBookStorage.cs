using lab5.Server.Models;

namespace lab5.Server.Services
{
    public interface IPhoneBookStorage
    {
        Task<List<Subscriber>> LoadAsync();
        Task SaveAsync(IEnumerable<Subscriber> subscribers);
        Task AppendAsync(Subscriber subscriber);
    }
}
