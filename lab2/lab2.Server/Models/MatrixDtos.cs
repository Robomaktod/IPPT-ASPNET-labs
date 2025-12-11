namespace lab2.Server.Models
{
    // Пара матриць A і B
    public class MatrixPairDto
    {
        public int Size { get; set; }
        public int[][] MatrixA { get; set; } = default!;
        public int[][] MatrixB { get; set; } = default!;
    }

    // Запит на дублювання рядка/стовпця
    public class DuplicateRequest
    {
        public int[][] MatrixA { get; set; } = default!;
        public int[][] MatrixB { get; set; } = default!;
        public int SourceIndex { get; set; }   // 0-based
        public int TargetIndex { get; set; }   // 0-based
        public bool IsRow { get; set; }        // true = row, false = column
    }

    // Запит на основні операції
    public class LabOperationsRequest
    {
        public int[][] MatrixA { get; set; } = default!;
        public int[][] MatrixB { get; set; } = default!;

        public int RowIndexA { get; set; }   // рядок A для різниці
        public int RowIndexB { get; set; }   // рядок B для різниці

        public int ColumnIndexK { get; set; } // стовпець k масиву B для C * column

        public int RowIndexP { get; set; }    // рядок p масиву A для декременту

        public int ColumnIndexM { get; set; } // стовпець m A
        public int ColumnIndexN { get; set; } // стовпець n B

        public int ScalarC { get; set; }      // C (2..5)
    }

    public class LabOperationsResult
    {
        public int[] RowDifference { get; set; } = default!;
        public int[] ScalarProduct { get; set; } = default!;
        public int[] DecrementedRow { get; set; } = default!;
        public bool ColumnsEqual { get; set; }
    }
}
