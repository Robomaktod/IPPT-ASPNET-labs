using System.Collections.Generic;
using Lab.Api.Models;
using Lab.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Lab.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabController : ControllerBase
    {
        private readonly ILabCalculator _calculator;

        public LabController(ILabCalculator calculator)
        {
            _calculator = calculator;
        }

        [HttpPost("sum-multiples-of-five")]
        public ActionResult<SumMultiplesOfFiveResult> SumMultiplesOfFive([FromBody] SumMultiplesOfFiveRequest request)
        {
            if (request == null)
            {
                return BadRequest("Request body is required.");
            }

            var result = _calculator.CalculateSumMultiplesOfFive(request.X, request.Z);
            return Ok(result);
        }

        [HttpGet("expressions")]
        public ActionResult<IEnumerable<ExpressionResult>> GetExpressions()
        {
            var list = _calculator.EvaluateExpressions();
            return Ok(list);
        }

        [HttpGet("interval/{index}")]
        public ActionResult<IntervalResult> GetInterval(int index)
        {
            if (index < 1 || index > 3)
            {
                return BadRequest("Index must be 1, 2 or 3.");
            }

            var result = _calculator.AnalyzeInterval(index);
            return Ok(result);
        }
    }
}
