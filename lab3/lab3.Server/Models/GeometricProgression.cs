namespace lab3.Server.Models
{
    // Похідний клас для геометричної прогресії
    public class GeometricProgression : Sequence
    {
        public double Ratio { get; private set; }

        public GeometricProgression(double firstTerm, double ratio, int count)
            : base(firstTerm, count)
        {
            Ratio = ratio;
        }

        public override double GetTerm(int index)
        {
            // геом. прогресія: a_n = a1 * q^(n-1)
            if (index < 1)
                throw new ArgumentOutOfRangeException(nameof(index));

            return FirstTerm * Math.Pow(Ratio, index - 1);
        }

        public override double[] GetAllTerms()
        {
            var arr = new double[Count];
            for (int i = 0; i < Count; i++)
            {
                arr[i] = GetTerm(i + 1);
            }
            return arr;
        }

        public override double GetSum()
        {
            if (Count <= 0) return 0;

            if (Math.Abs(Ratio - 1.0) < 1e-9)
            {
                // q = 1 → всі однакові
                return FirstTerm * Count;
            }

            return FirstTerm * (Math.Pow(Ratio, Count) - 1) / (Ratio - 1);
        }
    }
}
