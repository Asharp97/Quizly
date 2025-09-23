// Simple stopwatch utility to measure elapsed time in milliseconds
export function stopWatch() {
  let startTime = 0;
  // Starts the stopwatch
  function start() {
    startTime = new Date().getTime();
  }

  // Stops the stopwatch and returns elapsed time
  function stop() {
    return new Date().getTime() - startTime;
  }

  return {
    start,
    stop,
  };
}
