export function stopWatch() {
  let startTime = 0;
  function start() {
    startTime = new Date().getTime();
  }

  function stop() {
    return new Date().getTime() - startTime;
  }

  return {
    start,
    stop,
  };
}
