const readFileSync = require("fs").readFileSync;

const fileLinesToArray = (file) => {
  let lines = readFileSync(file)
                .toString('utf-8')
                .split("\n");
  return lines;
}
// The attitude of faith is to let go, and become open to truth.

module.exports = {
  fileLinesToArray: fileLinesToArray
}