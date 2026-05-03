import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getLeaderboard, searchResults, type QuizResult } from "@/lib/storageUtils";
import { Medal, Search } from "lucide-react";

interface LeaderboardProps {
  onReturnHome: () => void;
}

export default function Leaderboard({ onReturnHome }: LeaderboardProps) {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [searchResults_, setSearchResults_] = useState<QuizResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const leaderboard = getLeaderboard();
    setResults(leaderboard);
  }, []);

  const handleSearch = () => {
    if (searchFirstName.trim() || searchLastName.trim()) {
      const found = searchResults(searchFirstName, searchLastName);
      setSearchResults_(found);
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchFirstName("");
    setSearchLastName("");
    setSearchResults_([]);
    setIsSearching(false);
  };

  const displayResults = isSearching ? searchResults_ : results;
  const getRankColor = (rank: string): string => {
    const rankColors: Record<string, string> = {
      "In Training": "text-green-600",
      "Team Member": "text-red-600",
      "Trainer": "text-orange-600",
      "Team Leader": "text-red-700",
      "Shift Leader": "text-blue-700",
      "Coordinator": "text-gray-700",
      "Director": "text-black",
      "Operator": "text-yellow-600",
    };
    return rankColors[rank] || "text-gray-600";
  };

  const getMedalIcon = (index: number): string => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">CFA Leaderboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Top performers ranked by score</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 shadow-lg border-0 bg-white dark:bg-gray-800">
          <div className="flex gap-3 mb-4">
            <Input
              type="text"
              placeholder="First Name"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Input
              type="text"
              placeholder="Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              className="bg-[#d62300] hover:bg-[#c41e00] text-white px-6 font-bold flex items-center gap-2"
            >
              <Search size={18} />
              Search
            </Button>
            {isSearching && (
              <Button
                onClick={handleClearSearch}
                variant="outline"
                className="px-6"
              >
                Clear
              </Button>
            )}
          </div>
          {isSearching && searchResults_.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {searchResults_.length} result{searchResults_.length !== 1 ? "s" : ""}
            </p>
          )}
          {isSearching && searchResults_.length === 0 && (
            <p className="text-sm text-red-600 dark:text-red-400">No results found</p>
          )}
        </Card>

        {/* Results Table */}
        <Card className="p-6 mb-8 shadow-lg border-0 overflow-x-auto bg-white dark:bg-gray-800">
          {displayResults.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Rank</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Score</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Percentage</th>
                  <th className="text-center py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Title</th>
                  <th className="text-right py-3 px-4 font-bold text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {displayResults.map((result, index) => (
                  <tr
                    key={result.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getMedalIcon(index)}
                        <span className="font-bold text-gray-700 dark:text-gray-300">
                          {isSearching ? "-" : index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800 dark:text-gray-200">
                      {result.firstName} {result.lastName}
                    </td>
                    <td className="py-4 px-4 text-center text-gray-700 dark:text-gray-300">
                      {result.score} / {result.maxScore}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-[#d62300]">
                      {result.percentage}%
                    </td>
                    <td className={`py-4 px-4 text-center font-semibold ${getRankColor(result.rank)}`}>
                      {result.rank}
                    </td>
                    <td className="py-4 px-4 text-right text-sm text-gray-600 dark:text-gray-400">
                      {new Date(result.completedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No quiz results yet</p>
            </div>
          )}
        </Card>

        {/* Return Button */}
        <div className="flex justify-center">
          <Button
            onClick={onReturnHome}
            className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
          >
            ← Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
