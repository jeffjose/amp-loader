const { JSDOM } = require("jsdom");

function handleHTML(node, doc) {
  node.setAttribute("amp", "");
}

function handleStyleTag(node, doc) {
  styleTags = node.querySelectorAll("style");

  if (styleTags.length == 1) {
    styleTags[0].setAttribute("amp-custom", "");
  } else if (styleTags.length > 1) {
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

function handleBody(node, doc) {
  var imgs = doc.querySelectorAll("img");

  for (var i = 0; i < imgs.length; i++) {
    img = imgs[0];

    ampImg = doc.createElement("amp-img");
    for (var j = 0; j < img.attributes.length; j++) {
      attr = img.attributes[j];
      ampImg.setAttribute(attr.name, attr.value);
    }

    img.parentNode.insertBefore(ampImg, img);
    img.remove();
  }
}

function handleHead(node, doc) {
  handleStyleTag(node, doc);

  var meta = doc.querySelector("meta[charset]");
  if (meta == undefined) {
    meta = doc.createElement("meta");
  }
  meta.setAttribute("charset", "utf-8");
  node.appendChild(meta);

  var meta = doc.querySelector("meta[name=viewport]");
  if (meta == undefined) {
    meta = doc.createElement("meta");
  }
  meta.setAttribute("name", "viewport");
  meta.setAttribute("content", "width=device-width,minimum-scale=1");
  node.appendChild(meta);

  var style = doc.querySelector("style[amp-boilerplate]");
  if (style == undefined) {
    style = doc.createElement("style");
  }
  style.setAttribute("amp-boilerplate", "");
  style.textContent = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`;
  node.appendChild(style);

  var noscript = doc.querySelector("noscript");
  if (noscript == undefined) {
    noscript = doc.createElement("noscript");
  } else {
    // Remove the noscript straight up
    noscript.remove();
    noscript = doc.createElement("noscript");
  }

  var style = doc.createElement("style");
  style.setAttribute("amp-boilerplate", "");
  style.textContent = `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`;
  noscript.appendChild(style);

  node.appendChild(noscript);

  var scripts = doc.querySelectorAll("script");

  for (var i = 0; i < scripts.length; i++) {
    script = scripts[i];

    if (!script.src.startsWith("https://cdn.ampproject.org")) {
      console.log("found random script");
      // Dont remove because this script doesnt take a stance on whether to remove external javascript
      //script.remove();
    } else {
      script.setAttribute("async", "");
    }
  }

  var s = doc.createElement("script");
  s.setAttribute("async", "");
  s.setAttribute("src", "https://cdn.ampproject.org/v0.js");
  node.appendChild(s);

  var link = doc.createElement("link");
  link.setAttribute("rel", "canonical");
  // TODO
  link.setAttribute("href", "foo.html");
  node.appendChild(link);
}

module.exports = function(source) {
  const win = new JSDOM(source).window;

  var head = win.document.head;
  var body = win.document.body;

  handleHTML(win.document.documentElement, win.document);
  handleHead(head, win.document);
  handleBody(body, win.document);

  source = "<!doctype html> " + win.document.documentElement.outerHTML;
  //console.log(source);

  return "module.exports = " + JSON.stringify(source);
};
