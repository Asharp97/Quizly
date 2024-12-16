export function stats() {
  function destructure(x: Array<object>) {
    let arr = [];
    for (let i = 0; i < x.length; i++) arr.push(x[i].score);

    return arr;
  }

  function median(x: Array<object>) {
    let arr = destructure(x);

    arr.sort((a, b) => a - b);
    const middleIndex = Math.floor(arr.length / 2);

    if (arr.length % 2 === 0) {
      return (arr[middleIndex - 1] + arr[middleIndex]) / 2;
    } else {
      return arr[middleIndex];
    }
  }

  function avg(x: Array<object>) {
    let arr = destructure(x);
    return arr.reduce((a, b) => a + b) / arr.length;
  }

  return {
    median,
    avg,
  };
}
