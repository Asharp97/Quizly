export function stats() {
  function destructure(x: Array<object>) {
    let arr = [];
    for (let i = 0; i < x.length; i++) arr.push(x[i].score);

    return arr;
  }
  function round(x: number) {
    return Math.round(x * 100) / 100;
  }

  function median(x: Array<object>) {
    let arr = destructure(x);

    arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
      return round((arr[middleIndex - 1] + arr[middleIndex]) / 2);
    } else {
      return round(arr[middleIndex]);
    }
  }

  function avg(x: Array<object>) {
    let arr = destructure(x);
    return round(arr.reduce((a, b) => a + b) / arr.length);
  }

  return {
    median,
    round,
    avg,
  };
}
