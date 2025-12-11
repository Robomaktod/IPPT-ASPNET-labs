namespace lab5.Server.Models
{
    public abstract class Person
    {
        public string LastName { get; set; } = string.Empty;
        public string Initials { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
