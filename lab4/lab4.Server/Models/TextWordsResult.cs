namespace lab4.Server.Models
{
    public class TextWordsResult
    {
        public int TotalWords { get; set; }
        public List<WordInfo> WordsWithCounts { get; set; } = new();
        public string InvertedText { get; set; } = string.Empty;
    }
}
