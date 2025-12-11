using System.Collections.Generic;

namespace Lab.Api.Models
{
    public class SumMultiplesOfFiveResult
    {
        public int X { get; set; }
        public int Z { get; set; }
        public int Sum { get; set; }
        public List<int> Multiples { get; set; } = new();
    }
}
