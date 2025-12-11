using System.Text;
using lab5.Server.Models;
using lab5.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace lab5.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhoneBookController : ControllerBase
    {
        private readonly IPhoneBookService _service;

        public PhoneBookController(IPhoneBookService service)
        {
            _service = service;
        }

        // Виведення всіх даних (аналог DataGridView у новому вікні)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubscriberDto>>> GetAll()
        {
            var list = await _service.GetAllAsync();

            var result = list.Select(s => new SubscriberDto
            {
                LastName = s.LastName,
                Initials = s.Initials,
                Address = s.Address,
                CityCode = s.CityCode,
                PhoneNumber = s.PhoneNumber
            }).ToList();

            return Ok(result);
        }

        // Пошук за номером
        [HttpGet("search")]
        public async Task<ActionResult<SearchResultDto>> Search([FromQuery] string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return BadRequest("Номер телефону не може бути порожнім.");

            var list = await _service.FindByPhoneAsync(phone);

            var result = new SearchResultDto
            {
                PhoneQuery = phone,
                Results = list.Select(s => new SubscriberDto
                {
                    LastName = s.LastName,
                    Initials = s.Initials,
                    Address = s.Address,
                    CityCode = s.CityCode,
                    PhoneNumber = s.PhoneNumber
                }).ToList()
            };

            return Ok(result);
        }

        // Додавання абонента
        [HttpPost]
        public async Task<ActionResult> Add([FromBody] SubscriberDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                return BadRequest("Прізвище та номер телефону є обов'язковими.");
            }

            await _service.AddSubscriberAsync(dto);
            return Ok();
        }

        // Збереження результатів пошуку у новий файл (повертаємо файл клієнту)
        [HttpGet("export")]
        public async Task<IActionResult> Export([FromQuery] string phone)
        {
            if (string.IsNullOrWhiteSpace(phone))
                return BadRequest("Номер телефону не може бути порожнім.");

            var content = await _service.ExportSearchResultAsync(phone);

            var bytes = Encoding.UTF8.GetBytes(content);
            var stream = new MemoryStream(bytes);

            var fileName = $"Search_{phone}_{DateTime.Now:yyyyMMdd_HHmmss}.txt";

            return File(stream, "text/plain", fileName);
        }
    }
}
