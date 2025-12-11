using lab3.Server.Models;

namespace lab3.Server.Services
{
    public interface ILab3Service
    {
        GeometricProgressionResult Calculate(GeometricProgressionRequest request);
    }
}
