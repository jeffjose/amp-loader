var jsdom = require("jsdom");
module.exports = function(source) {
  console.log(JSON.stringify(source));
  return "module.exports = " + JSON.stringify(source);
};
