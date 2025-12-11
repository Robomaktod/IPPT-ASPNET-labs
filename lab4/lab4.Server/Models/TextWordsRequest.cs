namespace lab4.Server.Models
{
    public class TextWordsRequest
    {
        public string Text { get; set; } = string.Empty;
        public List<string> SelectedWords { get; set; } = new();
    }
}
