namespace lab4.Server.Models
{
    public class PrefixSearchResult
    {
        public string Prefix { get; set; } = string.Empty;
        public List<string> Words { get; set; } = new();
    }
}
