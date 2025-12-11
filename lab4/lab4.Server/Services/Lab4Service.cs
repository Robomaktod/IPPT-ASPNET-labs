using System.Text.RegularExpressions;
using lab4.Server.Models;

namespace lab4.Server.Services
{
    public class Lab4Service : ILab4Service
    {
        private static readonly Regex WordRegex = new(@"\p{L}+", RegexOptions.Multiline);

        public TextWordsResult AnalyzeWords(TextWordsRequest request)
        {
            var text = request.Text ?? string.Empty;

            var matches = WordRegex.Matches(text);
            var dict = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            foreach (Match match in matches)
            {
                var word = match.Value;
                if (dict.ContainsKey(word))
                    dict[word]++;
                else
                    dict[word] = 1;
            }

            // інверсія вибраних слів (reverse букв)
            var selected = new HashSet<string>(
                request.SelectedWords ?? new List<string>(),
                StringComparer.OrdinalIgnoreCase
            );

            var tokens = Regex.Split(text, @"(\p{L}+)");
            for (int i = 0; i < tokens.Length; i++)
            {
                if (WordRegex.IsMatch(tokens[i]))
                {
                    var w = tokens[i];
                    if (selected.Contains(w))
                    {
                        tokens[i] = new string(w.Reverse().ToArray());
                    }
                }
            }

            var invertedText = string.Join(string.Empty, tokens);

            return new TextWordsResult
            {
                TotalWords = matches.Count,
                WordsWithCounts = dict
                    .OrderBy(kv => kv.Key)
                    .Select(kv => new WordInfo
                    {
                        Word = kv.Key,
                        Count = kv.Value
                    })
                    .ToList(),
                InvertedText = invertedText
            };
        }

        public PrefixSearchResult FindWordsWithPrefix(PrefixSearchRequest request)
        {
            var text = request.Text ?? string.Empty;
            var prefix = request.Prefix ?? "при";

            var result = new PrefixSearchResult
            {
                Prefix = prefix
            };

            var matches = WordRegex.Matches(text);
            var list = new List<string>();

            foreach (Match match in matches)
            {
                var word = match.Value;
                if (word.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                {
                    list.Add(word);
                }
            }

            result.Words = list.Distinct(StringComparer.OrdinalIgnoreCase).ToList();
            return result;
        }

        public LetterStatsResult CountLetters(LetterStatsRequest request)
        {
            var text = request.Sentence ?? string.Empty;

            int u = 0, e = 0, c = 0, k = 0, d = 0;

            foreach (var ch in text)
            {
                switch (char.ToLowerInvariant(ch))
                {
                    case 'у': u++; break;
                    case 'е': e++; break;

                    case 'ц': c++; break;
                    case 'к': k++; break;
                    case 'д': d++; break;
                }
            }

            return new LetterStatsResult
            {
                CountU = u,
                CountE = e,
                CountC = c,
                CountK = k,
                CountD = d,
                TotalVowels = u + e,
                TotalConsonants = c + k + d
            };
        }

        public RegexSearchResult SearchByPattern(RegexSearchRequest request)
        {
            // Шаблон з умови (трохи поправлений, щоб працював у .NET)
            const string pattern = @"\bag\d{1,3}z.j([t-z]|[k-n])...\d";

            var regex = new Regex(pattern);

            var lines = request.Lines ?? new List<string>();
            var matches = new List<string>();

            foreach (var line in lines)
            {
                if (regex.IsMatch(line))
                    matches.Add(line);
            }

            return new RegexSearchResult
            {
                Pattern = pattern,
                MatchingLines = matches
            };
        }
    }
}
