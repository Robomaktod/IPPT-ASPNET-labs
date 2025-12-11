namespace lab4.Server.Models
{
    public class LetterStatsResult
    {
        public int TotalVowels { get; set; }   // у, е
        public int TotalConsonants { get; set; } // ц, к, д

        public int CountU { get; set; }
        public int CountE { get; set; }

        public int CountC { get; set; } // ц
        public int CountK { get; set; } // к
        public int CountD { get; set; } // д
    }
}
