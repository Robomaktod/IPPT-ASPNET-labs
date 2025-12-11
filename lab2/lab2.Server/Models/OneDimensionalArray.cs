namespace lab2.Server.Models
{
    public class OneDimensionalArray
    {
        public int[] Values { get; }

        public int Length => Values.Length;

        public OneDimensionalArray(int length)
        {
            Values = new int[length];
        }

        public OneDimensionalArray(int[] values)
        {
            Values = values.ToArray(); // копія
        }

        public int this[int index]
        {
            get => Values[index];
            set => Values[index] = value;
        }

        // A - B : різниця елементів
        public static OneDimensionalArray operator -(OneDimensionalArray a, OneDimensionalArray b)
        {
            if (a is null || b is null)
                throw new ArgumentNullException();

            if (a.Length != b.Length)
                throw new ArgumentException("Arrays must have the same length.");

            var result = new int[a.Length];
            for (int i = 0; i < a.Length; i++)
            {
                result[i] = a.Values[i] - b.Values[i];
            }

            return new OneDimensionalArray(result);
        }

        // C * A
        public static OneDimensionalArray operator *(int c, OneDimensionalArray a)
        {
            if (a is null) throw new ArgumentNullException(nameof(a));

            var result = new int[a.Length];
            for (int i = 0; i < a.Length; i++)
            {
                result[i] = c * a.Values[i];
            }

            return new OneDimensionalArray(result);
        }

        // A * C (делегує в C * A)
        public static OneDimensionalArray operator *(OneDimensionalArray a, int c)
            => c * a;

        // --A : зменшити кожен елемент на 2
        public static OneDimensionalArray operator --(OneDimensionalArray a)
        {
            if (a is null) throw new ArgumentNullException(nameof(a));

            for (int i = 0; i < a.Length; i++)
            {
                a.Values[i] -= 2;
            }

            return a;
        }

        public static bool operator ==(OneDimensionalArray? a, OneDimensionalArray? b)
        {
            if (ReferenceEquals(a, b))
                return true;
            if (a is null || b is null)
                return false;
            if (a.Length != b.Length)
                return false;

            for (int i = 0; i < a.Length; i++)
            {
                if (a.Values[i] != b.Values[i]) return false;
            }

            return true;
        }

        public static bool operator !=(OneDimensionalArray? a, OneDimensionalArray? b)
            => !(a == b);

        public override bool Equals(object? obj)
        {
            if (obj is not OneDimensionalArray other) return false;
            return this == other;
        }

        public override int GetHashCode()
        {
            var hash = new HashCode();
            foreach (var v in Values)
            {
                hash.Add(v);
            }
            return hash.ToHashCode();
        }
    }
}
