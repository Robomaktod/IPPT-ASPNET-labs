using lab2.Server.Models;
using lab2.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace lab2.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Lab2Controller : ControllerBase
    {
        private readonly ILab2Service _service;

        public Lab2Controller(ILab2Service service)
        {
            _service = service;
        }

        // GET api/lab2/generate?size=3
        [HttpGet("generate")]
        public ActionResult<MatrixPairDto> Generate([FromQuery] int size = 3)
        {
            try
            {
                var result = _service.GenerateMatrices(size);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/lab2/duplicate
        [HttpPost("duplicate")]
        public ActionResult<MatrixPairDto> Duplicate([FromBody] DuplicateRequest request)
        {
            var result = _service.DuplicateRowOrColumn(request);
            return Ok(result);
        }

        // POST api/lab2/operations
        [HttpPost("operations")]
        public ActionResult<LabOperationsResult> Operations([FromBody] LabOperationsRequest request)
        {
            var result = _service.PerformOperations(request);
            return Ok(result);
        }
    }
}
