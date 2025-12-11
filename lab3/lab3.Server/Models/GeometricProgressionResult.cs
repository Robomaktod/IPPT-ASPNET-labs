namespace lab3.Server.Models
{
    public class GeometricProgressionResult
    {
        public double[] Terms { get; set; } = Array.Empty<double>();
        public double Sum { get; set; }
        public double KthTerm { get; set; }

        public int FirstTerm { get; set; }
        public int Ratio { get; set; }
        public int Count { get; set; }
        public int IndexK { get; set; }
    }
}
