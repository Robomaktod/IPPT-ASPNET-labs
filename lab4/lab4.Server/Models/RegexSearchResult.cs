namespace lab4.Server.Models
{
    public class RegexSearchResult
    {
        public string Pattern { get; set; } = string.Empty;
        public List<string> MatchingLines { get; set; } = new();
    }
}
