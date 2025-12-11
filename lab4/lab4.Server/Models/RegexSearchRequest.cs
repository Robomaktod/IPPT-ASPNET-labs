namespace lab4.Server.Models
{
    public class RegexSearchRequest
    {
        // Кожен рядок — окремий ряд для пошуку
        public List<string> Lines { get; set; } = new();
    }
}
