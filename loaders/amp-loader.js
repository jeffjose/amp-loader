const { JSDOM } = require("jsdom");

const headString = `
  <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1">
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
`;

function handleHTML(node, doc) {
  node.setAttribute("amp", "");
}
function handleHead(node, doc) {
  var meta = doc.createElement("meta");
  meta.setAttribute("charset", "utf-8");
  node.appendChild(meta);

  var meta = doc.createElement("meta");
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width,minimum-scale=1");
  node.appendChild(meta);

  var style = doc.createElement("style", "amp-boilerplate");
  style.textContent = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`;
  node.appendChild(style);

  var script = doc.createElement("script", "async");
  script.setAttribute("src", "https://cdn.ampproject.org/v0.js");
  node.appendChild(script);
}

function handleBody(node, doc) {}

module.exports = function(source) {
  const win = new JSDOM(source).window;

  // console.log(JSON.stringify(source));

  var head = win.document.head;
  var body = win.document.body;

  handleHTML(win.document.documentElement, win.document);
  handleHead(head, win.document);

  console.log(win.document.documentElement.outerHTML);

  return "module.exports = " + JSON.stringify(source);
};
