using lab2.Server.Models;

namespace lab2.Server.Services
{
    public interface ILab2Service
    {
        MatrixPairDto GenerateMatrices(int size);
        MatrixPairDto DuplicateRowOrColumn(DuplicateRequest request);
        LabOperationsResult PerformOperations(LabOperationsRequest request);
    }
}
