export interface QuizResult {
  id: string;
  firstName: string;
  lastName: string;
  score: number;
  maxScore: number;
  percentage: number;
  rank: string;
  completedAt: number; // timestamp
}

export interface QuizProgress {
  firstName: string;
  lastName: string;
  startedAt: number;
  currentQuestionIndex: number;
  answers: (number | string | null)[];
}

const STORAGE_KEYS = {
  QUIZ_PROGRESS: "cfa_quiz_progress",
  QUIZ_RESULTS: "cfa_quiz_results",
};

export function saveQuizProgress(progress: QuizProgress): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save quiz progress:", error);
  }
}

export function getQuizProgress(): QuizProgress | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to get quiz progress:", error);
    return null;
  }
}

export function clearQuizProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
  } catch (error) {
    console.error("Failed to clear quiz progress:", error);
  }
}

export function saveQuizResult(result: QuizResult): void {
  try {
    const results = getAllResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error("Failed to save quiz result:", error);
  }
}

export function getAllResults(): QuizResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get quiz results:", error);
    return [];
  }
}

export function searchResults(firstName: string, lastName: string): QuizResult[] {
  const results = getAllResults();
  const searchFirstName = firstName.toLowerCase().trim();
  const searchLastName = lastName.toLowerCase().trim();

  return results.filter((result) => {
    const matchFirst = result.firstName.toLowerCase().includes(searchFirstName);
    const matchLast = result.lastName.toLowerCase().includes(searchLastName);
    return matchFirst && matchLast;
  });
}

export function getLeaderboard(): QuizResult[] {
  const results = getAllResults();
  // Sort by percentage descending, then by timestamp ascending (earliest first for ties)
  return results.sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    }
    return a.completedAt - b.completedAt;
  });
}

export function hasActiveQuizProgress(): boolean {
  const progress = getQuizProgress();
  if (!progress) return false;

  // Check if progress is from today (within 24 hours)
  const now = Date.now();
  const progressAge = now - progress.startedAt;
  const oneDayMs = 24 * 60 * 60 * 1000;

  return progressAge < oneDayMs;
}
