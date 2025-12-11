namespace lab3.Server.Models
{
    // Дані від клієнта: 4 numericUpDown
    public class GeometricProgressionRequest
    {
        // numericUpDown1 = [-50, 50] – перший член a1
        public int FirstTerm { get; set; }

        // numericUpDown2 = [1, 25] – знаменник прогресії q
        public int Ratio { get; set; }

        // numericUpDown3 = [5, 20] – кількість елементів n
        public int Count { get; set; }

        // numericUpDown4 = [1, 30] – номер члена k, який окремо порахуємо
        public int IndexK { get; set; }
    }
}
