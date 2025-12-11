using lab2.Server.Models;

namespace lab2.Server.Services
{
    public class Lab2Service : ILab2Service
    {
        private readonly Random _random = new();

        public MatrixPairDto GenerateMatrices(int size)
        {
            if (size is not (3 or 4 or 5))
                throw new ArgumentException("Size must be 3, 4 or 5.", nameof(size));

            var a = CreateRandomMatrix(size);
            var b = CreateRandomMatrix(size);

            return new MatrixPairDto
            {
                Size = size,
                MatrixA = a,
                MatrixB = b
            };
        }

        public MatrixPairDto DuplicateRowOrColumn(DuplicateRequest request)
        {
            int size = request.MatrixA.Length;
            var a = CloneMatrix(request.MatrixA);
            var b = CloneMatrix(request.MatrixB);

            if (request.IsRow)
            {
                // копіюємо рядок i з A в рядок j B
                for (int col = 0; col < size; col++)
                {
                    b[request.TargetIndex][col] = a[request.SourceIndex][col];
                }
            }
            else
            {
                // копіюємо стовпець i з A в стовпець j B
                for (int row = 0; row < size; row++)
                {
                    b[row][request.TargetIndex] = a[row][request.SourceIndex];
                }
            }

            return new MatrixPairDto
            {
                Size = size,
                MatrixA = a,
                MatrixB = b
            };
        }

        public LabOperationsResult PerformOperations(LabOperationsRequest request)
        {
            int size = request.MatrixA.Length;
            var a = CloneMatrix(request.MatrixA);
            var b = CloneMatrix(request.MatrixB);

            // 1) різниця заданих рядків матриць A та B
            var rowA = ExtractRow(a, request.RowIndexA);
            var rowB = ExtractRow(b, request.RowIndexB);

            OneDimensionalArray arrRowA = new(rowA);
            OneDimensionalArray arrRowB = new(rowB);

            OneDimensionalArray diff = arrRowA - arrRowB;

            // 2) добуток числа C на стовпець k масиву B
            var colK = ExtractColumn(b, request.ColumnIndexK);
            OneDimensionalArray arrColK = new(colK);
            OneDimensionalArray scalarProd = request.ScalarC * arrColK;

            // 3) декрементувати (--) елементи рядка p масиву A
            var rowP = ExtractRow(a, request.RowIndexP);
            OneDimensionalArray arrRowP = new(rowP);
            --arrRowP;

            // 4) перевірити рівність стовпців m матриці A та n матриці B
            var colM = ExtractColumn(a, request.ColumnIndexM);
            var colN = ExtractColumn(b, request.ColumnIndexN);

            OneDimensionalArray arrColM = new(colM);
            OneDimensionalArray arrColN = new(colN);

            bool equal = arrColM == arrColN;

            return new LabOperationsResult
            {
                RowDifference = diff.Values,
                ScalarProduct = scalarProd.Values,
                DecrementedRow = arrRowP.Values,
                ColumnsEqual = equal
            };
        }

        // ===== helper methods =====

        private int[][] CreateRandomMatrix(int size)
        {
            var matrix = new int[size][];
            for (int i = 0; i < size; i++)
            {
                matrix[i] = new int[size];
                for (int j = 0; j < size; j++)
                {
                    matrix[i][j] = _random.Next(0, 11); // [0,10]
                }
            }

            return matrix;
        }

        private int[][] CloneMatrix(int[][] source)
        {
            int size = source.Length;
            var result = new int[size][];
            for (int i = 0; i < size; i++)
            {
                result[i] = source[i].ToArray();
            }
            return result;
        }

        private int[] ExtractRow(int[][] matrix, int rowIndex)
        {
            int size = matrix.Length;
            var row = new int[size];
            for (int j = 0; j < size; j++)
            {
                row[j] = matrix[rowIndex][j];
            }
            return row;
        }

        private int[] ExtractColumn(int[][] matrix, int columnIndex)
        {
            int size = matrix.Length;
            var column = new int[size];
            for (int i = 0; i < size; i++)
            {
                column[i] = matrix[i][columnIndex];
            }
            return column;
        }
    }
}
