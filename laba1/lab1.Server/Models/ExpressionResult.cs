namespace Lab.Api.Models
{
    public class ExpressionResult
    {
        public string Expression { get; set; } = string.Empty;
        public string ResultText { get; set; } = string.Empty;
        public string ResultType { get; set; } = string.Empty;
        public int FinalN { get; set; }
        public int FinalZ { get; set; }
    }
}
