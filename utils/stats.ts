// Provides statistical and grading utilities for quiz scores
export function stats() {
  // Rounds a number to two decimal places
  function round(x: number) {
    return Math.round(x * 100) / 100;
  }

  // Calculates the median of an array
  function median(arr: Array<number>) {
    arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
      return round((arr[middleIndex - 1] + arr[middleIndex]) / 2);
    } else {
      return round(arr[middleIndex]);
    }
  }

  // Calculates the average of an array
  function avg(arr: Array<number>) {
    return round(arr.reduce((a, b) => a + b) / arr.length);
  }

  // Calculates the mean of an array
  const mean = (scores: Array<number>) => {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  // Calculates the standard deviation of an array
  const sd = (scores: Array<number>, mean: number) => {
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    return Math.sqrt(variance);
  };

  // Assigns a grade based on score, mean, and standard deviation
  function curve(score: number, mean: number, sd: number) {
    if (score > mean + 1.5 * sd) return "A+";
    if (score > mean + 1 * sd) return "A";
    if (score > mean + 0.5 * sd) return "B+";
    if (score >= mean - 0.5 * sd) return "B";
    if (score >= mean - 1 * sd) return "C+";
    if (score >= mean - 1.5 * sd) return "C";
    return "F";
  }

  // Grades a score or array of scores using the curve function
  const grade = (scores: number | number[], scoresList: Array<number>) => {
    if (Array.isArray(scores)) {
      return scores.map((score) =>
        curve(score, mean(scoresList), sd(scoresList, mean(scoresList)))
      );
    } else {
      return curve(scores, mean(scoresList), sd(scoresList, mean(scoresList)));
    }
  };

  // Returns grade counts for charting purposes
  function gradeWithCounts(scoresList: number[]) {
    const grades = scoresList.map((score) =>
      curve(score, mean(scoresList), sd(scoresList, mean(scoresList)))
    );

    // Initialize grade counts
    const gradeCounts: Record<string, number> = {
      "A+": 0,
      A: 0,
      "B+": 0,
      B: 0,
      "C+": 0,
      C: 0,
      F: 0,
    };

    // Count occurrences of each grade
    grades.forEach((grade) => {
      gradeCounts[grade]++;
    });

    // Format data array for the chart
    const data = Object.keys(gradeCounts).map((grade) => ({
      value: gradeCounts[grade],
      name: grade,
    }));

    return data;
  }

  // Exported statistical and grading functions
  return {
    median,
    round,
    gradeWithCounts,
    mean,
    sd,
    grade,
    avg,
  };
}
