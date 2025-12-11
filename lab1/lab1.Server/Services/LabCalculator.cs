using System;
using System.Collections.Generic;
using Lab.Api.Models;

namespace Lab.Api.Services
{
    public class LabCalculator : ILabCalculator
    {
        public SumMultiplesOfFiveResult CalculateSumMultiplesOfFive(int x, int z)
        {
            if (x > z)
            {
                var temp = x;
                x = z;
                z = temp;
            }

            var result = new SumMultiplesOfFiveResult
            {
                X = x,
                Z = z
            };

            for (int i = x; i <= z; i++)
            {
                if (i % 5 == 0)
                {
                    result.Multiples.Add(i);
                    result.Sum += i;
                }
            }

            return result;
        }

        public List<ExpressionResult> EvaluateExpressions()
        {
            var list = new List<ExpressionResult>();

            {
                int n = 2;
                int z = 1;

                int value = ++n * 2 + z++;
                list.Add(new ExpressionResult
                {
                    Expression = "++n*2+z++",
                    ResultText = value.ToString(),
                    ResultType = value.GetType().Name,
                    FinalN = n,
                    FinalZ = z
                });
            }

            {
                int n = 2;
                int z = 1;

                bool value = z+++7 == n*4;
                list.Add(new ExpressionResult
                {
                    Expression = "z+++7 == n*4",
                    ResultText = value.ToString(),
                    ResultType = value.GetType().Name,
                    FinalN = n,
                    FinalZ = z
                });
            }

            {
                int n = 2;
                int z = 1;

                int value = (n - z > 0) && (z + n < 0) ? n : -z;
                list.Add(new ExpressionResult
                {
                    Expression = "(n - z > 0) && (z + n < 0) ? n : -z",
                    ResultText = value.ToString(),
                    ResultType = value.GetType().Name,
                    FinalN = n,
                    FinalZ = z
                });
            }

            return list;
        }

        public IntervalResult AnalyzeInterval(int intervalIndex)
        {
            int a, b;

            switch (intervalIndex)
            {
                case 1:
                    a = -200;
                    b = 350;
                    break;
                case 2:
                    a = -50;
                    b = 20;
                    break;
                case 3:
                    a = 10;
                    b = 150;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(intervalIndex),
                        "Interval index must be 1, 2, or 3.");
            }

            var result = new IntervalResult
            {
                A = a,
                B = b
            };

            int? minPositive = null;
            int? maxPositive = null;

            if (b > 0)
            {
                int candidateMin = a < 1 ? 1 : a;
                if (candidateMin <= b && candidateMin > 0)
                {
                    minPositive = candidateMin;
                }

                maxPositive = b;
            }

            result.MinPositive = minPositive;
            result.MaxPositive = maxPositive;

            return result;
        }
    }
}
