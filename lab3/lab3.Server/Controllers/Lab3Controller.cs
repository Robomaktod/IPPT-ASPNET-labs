using lab3.Server.Models;
using lab3.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace lab3.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class Lab3Controller : ControllerBase
    {
        private readonly ILab3Service _service;

        public Lab3Controller(ILab3Service service)
        {
            _service = service;
        }

        [HttpPost("geometric")]
        public ActionResult<GeometricProgressionResult> Geometric([FromBody] GeometricProgressionRequest request)
        {
            try
            {
                var result = _service.Calculate(request);
                return Ok(result);
            }
            catch (ArgumentOutOfRangeException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
