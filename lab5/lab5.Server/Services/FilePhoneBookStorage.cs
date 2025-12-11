using System.Text;
using lab5.Server.Models;

namespace lab5.Server.Services
{
    public class FilePhoneBookStorage : IPhoneBookStorage
    {
        private readonly string _filePath;

        public FilePhoneBookStorage(IWebHostEnvironment env)
        {
            var dataDir = Path.Combine(env.ContentRootPath, "App_Data");
            if (!Directory.Exists(dataDir))
            {
                Directory.CreateDirectory(dataDir);
            }

            _filePath = Path.Combine(dataDir, "phonebook.txt");

            if (!File.Exists(_filePath))
            {
                InitializeSampleData();
            }
        }

        private void InitializeSampleData()
        {
            var sample = new[]
            {
                "Петренко;І.П.;м. Київ, вул. Хрещатик, 1;044;1234567",
                "Іванов;П.О.;м. Львів, пр. Свободи, 10;032;7654321",
                "Сидоренко;А.В.;м. Одеса, вул. Дерибасівська, 5;048;9876543",
                "Коваленко;Л.М.;м. Харків, пр. Науки, 15;057;5551122"
            };
            File.WriteAllLines(_filePath, sample, Encoding.UTF8);
        }

        public async Task<List<Subscriber>> LoadAsync()
        {
            var list = new List<Subscriber>();

            if (!File.Exists(_filePath))
                return list;

            var lines = await File.ReadAllLinesAsync(_filePath, Encoding.UTF8);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line)) continue;

                var parts = line.Split(';');
                if (parts.Length < 5) continue;

                list.Add(new Subscriber
                {
                    LastName = parts[0].Trim(),
                    Initials = parts[1].Trim(),
                    Address = parts[2].Trim(),
                    CityCode = parts[3].Trim(),
                    PhoneNumber = parts[4].Trim()
                });
            }

            return list;
        }

        public async Task SaveAsync(IEnumerable<Subscriber> subscribers)
        {
            var lines = subscribers.Select(s =>
                $"{s.LastName};{s.Initials};{s.Address};{s.CityCode};{s.PhoneNumber}");

            await File.WriteAllLinesAsync(_filePath, lines, Encoding.UTF8);
        }

        public async Task AppendAsync(Subscriber subscriber)
        {
            var line =
                $"{subscriber.LastName};{subscriber.Initials};{subscriber.Address};{subscriber.CityCode};{subscriber.PhoneNumber}";

            await File.AppendAllTextAsync(_filePath, line + Environment.NewLine, Encoding.UTF8);
        }
    }
}
