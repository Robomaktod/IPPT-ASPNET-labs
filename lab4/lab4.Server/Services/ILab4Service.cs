using lab4.Server.Models;

namespace lab4.Server.Services
{
    public interface ILab4Service
    {
        TextWordsResult AnalyzeWords(TextWordsRequest request);
        PrefixSearchResult FindWordsWithPrefix(PrefixSearchRequest request);
        LetterStatsResult CountLetters(LetterStatsRequest request);
        RegexSearchResult SearchByPattern(RegexSearchRequest request);
    }
}
