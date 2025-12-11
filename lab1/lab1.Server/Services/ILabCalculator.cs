using System.Collections.Generic;
using Lab.Api.Models;

namespace Lab.Api.Services
{
    public interface ILabCalculator
    {
        SumMultiplesOfFiveResult CalculateSumMultiplesOfFive(int x, int z);
        List<ExpressionResult> EvaluateExpressions();
        IntervalResult AnalyzeInterval(int intervalIndex);
    }
}
