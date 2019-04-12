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

function handleStyleTag(node, doc) {
  styleTags = node.querySelectorAll("style");

  if (styleTags.length == 1) {
    styleTags[0].setAttribute("amp-custom", "");
  } else if (styleTags.length > 1) {
    console.log("more than 1");
    console.log(styleTags);

    var styleString = "";
    for (var i = 0; i < styleTags.length; i++) {
      tag = styleTags[i];
      styleString = `${styleString}\n${tag.textContent}`;

      tag.parentNode.removeChild(tag);
    }

    var style = doc.createElement("style");
    style.setAttribute("amp-custom", "");
    style.textContent = styleString;
    node.appendChild(style);
  }
}

function handleHead(node, doc) {
  handleStyleTag(node, doc);

  var meta = doc.createElement("meta");
  meta.setAttribute("charset", "utf-8");
  node.appendChild(meta);

  var meta = doc.createElement("meta");
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width,minimum-scale=1");
  node.appendChild(meta);

  var style = doc.createElement("style");
  style.setAttribute("amp-boilerplate", "");
  style.textContent = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`;
  node.appendChild(style);

  var noscript = doc.createElement("noscript");

  var style = doc.createElement("style");
  style.setAttribute("amp-boilerplate", "");
  style.textContent = `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`;
  noscript.appendChild(style);

  node.appendChild(noscript);

  var script = doc.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("src", "https://cdn.ampproject.org/v0.js");
  node.appendChild(script);

  var link = doc.createElement("link");
  link.setAttribute("rel", "canonical");
  link.setAttribute("href", "foo.html");
  node.appendChild(link);
}

function handleBody(node, doc) {}

module.exports = function(source) {
  const win = new JSDOM(source).window;

  var head = win.document.head;
  var body = win.document.body;

  handleHTML(win.document.documentElement, win.document);
  handleHead(head, win.document);

  source = "<!doctype html> " + win.document.documentElement.outerHTML;
  //console.log(source);

  return "module.exports = " + JSON.stringify(source);
};
