using lab5.Server.Models;

namespace lab5.Server.Services
{
    public interface IPhoneBookService
    {
        Task<List<Subscriber>> GetAllAsync();
        Task<List<Subscriber>> FindByPhoneAsync(string phoneNumber);
        Task AddSubscriberAsync(SubscriberDto dto);
        Task<string> ExportSearchResultAsync(string phoneNumber);
    }
}
