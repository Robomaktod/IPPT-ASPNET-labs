namespace lab5.Server.Models
{
    public class Subscriber : Person, IPrintable
    {
        public string CityCode { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;

        public string ToPrintableString()
        {
            return $"{LastName} {Initials}, {Address}, код міста: {CityCode}, телефон: {PhoneNumber}";
        }
    }
}
