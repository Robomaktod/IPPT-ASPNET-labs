using lab3.Server.Models;

namespace lab3.Server.Services
{
    public class Lab3Service : ILab3Service
    {
        public GeometricProgressionResult Calculate(GeometricProgressionRequest request)
        {
            // Валідація як numericUpDown-діапазони
            if (request.FirstTerm < -50 || request.FirstTerm > 50)
                throw new ArgumentOutOfRangeException(nameof(request.FirstTerm));

            if (request.Ratio < 1 || request.Ratio > 25)
                throw new ArgumentOutOfRangeException(nameof(request.Ratio));

            if (request.Count < 5 || request.Count > 20)
                throw new ArgumentOutOfRangeException(nameof(request.Count));

            if (request.IndexK < 1 || request.IndexK > 30)
                throw new ArgumentOutOfRangeException(nameof(request.IndexK));

            var gp = new GeometricProgression(
                firstTerm: request.FirstTerm,
                ratio: request.Ratio,
                count: request.Count
            );

            var terms = gp.GetAllTerms();
            var sum = gp.GetSum();
            var kth = gp.GetTerm(request.IndexK); // k може бути > Count – це ок

            return new GeometricProgressionResult
            {
                Terms = terms,
                Sum = sum,
                KthTerm = kth,
                FirstTerm = request.FirstTerm,
                Ratio = request.Ratio,
                Count = request.Count,
                IndexK = request.IndexK
            };
        }
    }
}
