namespace lab5.Server.Models
{
    public class SearchResultDto
    {
        public string PhoneQuery { get; set; } = string.Empty;
        public List<SubscriberDto> Results { get; set; } = new();
    }
}
