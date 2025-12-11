using lab4.Server.Models;
using lab4.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace lab4.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Lab4Controller : ControllerBase
    {
        private readonly ILab4Service _service;

        public Lab4Controller(ILab4Service service)
        {
            _service = service;
        }

        // 1. Виділення слів, підрахунок, інверсія
        [HttpPost("words")]
        public ActionResult<TextWordsResult> Words([FromBody] TextWordsRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Текст не може бути порожнім.");

            var result = _service.AnalyzeWords(request);
            return Ok(result);
        }

        // 2. Слова, що починаються з "при"
        [HttpPost("prefix")]
        public ActionResult<PrefixSearchResult> Prefix([FromBody] PrefixSearchRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest("Текст не може бути порожнім.");

            if (string.IsNullOrWhiteSpace(request.Prefix))
                request.Prefix = "при";

            var result = _service.FindWordsWithPrefix(request);
            return Ok(result);
        }

        // 3. Кількість голосних/приголосних
        [HttpPost("letters")]
        public ActionResult<LetterStatsResult> Letters([FromBody] LetterStatsRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Sentence))
                return BadRequest("Речення не може бути порожнім.");

            var result = _service.CountLetters(request);
            return Ok(result);
        }

        // 4. Пошук по шаблону
        [HttpPost("regex")]
        public ActionResult<RegexSearchResult> RegexSearch([FromBody] RegexSearchRequest request)
        {
            var result = _service.SearchByPattern(request);
            return Ok(result);
        }
    }
}
