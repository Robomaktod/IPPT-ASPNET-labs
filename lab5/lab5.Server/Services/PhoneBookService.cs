using System.Text;
using lab5.Server.Models;

namespace lab5.Server.Services
{
    public class PhoneBookService : IPhoneBookService
    {
        private readonly IPhoneBookStorage _storage;

        public PhoneBookService(IPhoneBookStorage storage)
        {
            _storage = storage;
        }

        public async Task<List<Subscriber>> GetAllAsync()
        {
            return await _storage.LoadAsync();
        }

        public async Task<List<Subscriber>> FindByPhoneAsync(string phoneNumber)
        {
            var all = await _storage.LoadAsync();
            phoneNumber = phoneNumber.Trim();

            return all
                .Where(s => s.PhoneNumber.Contains(phoneNumber, StringComparison.OrdinalIgnoreCase))
                .ToList();
        }

        public async Task AddSubscriberAsync(SubscriberDto dto)
        {
            var subscriber = new Subscriber
            {
                LastName = dto.LastName.Trim(),
                Initials = dto.Initials.Trim(),
                Address = dto.Address.Trim(),
                CityCode = dto.CityCode.Trim(),
                PhoneNumber = dto.PhoneNumber.Trim()
            };

            await _storage.AppendAsync(subscriber);
        }

        // Генерація текстового контенту для збереження у новий файл
        public async Task<string> ExportSearchResultAsync(string phoneNumber)
        {
            var matches = await FindByPhoneAsync(phoneNumber);
            var sb = new StringBuilder();

            sb.AppendLine($"Результати пошуку за номером: {phoneNumber}");
            sb.AppendLine();

            foreach (var s in matches)
            {
                if (s is IPrintable printable)
                {
                    sb.AppendLine(printable.ToPrintableString());
                }
                else
                {
                    sb.AppendLine(
                        $"{s.LastName} {s.Initials}, {s.Address}, {s.CityCode}, {s.PhoneNumber}"
                    );
                }
            }

            return sb.ToString();
        }
    }
}
