namespace lab3.Server.Models
{
    // Базовий клас для послідовностей
    public abstract class Sequence
    {
        public double FirstTerm { get; protected set; }
        public int Count { get; protected set; }

        protected Sequence(double firstTerm, int count)
        {
            FirstTerm = firstTerm;
            Count = count;
        }

        // Одноелементні операції
        public abstract double GetTerm(int index); // index: 1..Count (або й більше)
        public abstract double[] GetAllTerms();
        public abstract double GetSum();
    }
}
