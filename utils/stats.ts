export function stats() {
  function round(x: number) {
    return Math.round(x * 100) / 100;
  }

  function median(arr: Array<number>) {
    arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
      return round((arr[middleIndex - 1] + arr[middleIndex]) / 2);
    } else {
      return round(arr[middleIndex]);
    }
  }

  function avg(arr: Array<number>) {
    return round(arr.reduce((a, b) => a + b) / arr.length);
  }

  const mean = (scores: Array<number>) => {
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const sd = (scores: Array<number>, mean: number) => {
    const variance =
      scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) /
      scores.length;
    return Math.sqrt(variance);
  };

  function curve(score: number, mean: number, sd: number) {
    if (score > mean + 1.5 * sd) return "A+";
    if (score > mean + 1 * sd) return "A";
    if (score > mean + 0.5 * sd) return "B+";
    if (score >= mean - 0.5 * sd) return "B";
    if (score >= mean - 1 * sd) return "C+";
    if (score >= mean - 1.5 * sd) return "C";
    return "F";
  }

  const grade = (scores: number | number[], scoresList: Array<number>) => {
    if (Array.isArray(scores)) {
      return scores.map((score) =>
        curve(score, mean(scoresList), sd(scoresList, mean(scoresList)))
      );
    } else {
      return curve(scores, mean(scoresList), sd(scoresList, mean(scoresList)));
    }
  };
  function gradeWithCounts(scoresList: number[]) {
    const grades = scoresList.map((score) => curve(score, mean(scoresList), sd(scoresList, mean(scoresList))));
  
    // Initialize grade counts
    const gradeCounts: Record<string, number> = {
      "A+": 0,
      "A": 0,
      "B+": 0,
      "B": 0,
      "C+": 0,
      "C": 0,
      "F": 0,
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
