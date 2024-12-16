export function clockFormate(elapsedTime: number) {
  var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
  var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
  var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
  return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);

  function pad(number: number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
  }
}
