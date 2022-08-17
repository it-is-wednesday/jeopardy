/**
 * I'm aware of https://github.com/tholman/cursor-effects
 * but it's way too modern and I don't have the nerve to figure out why it
 * looks too smooth. This script looks old. In a good way
 */
let colour = "#2c88ad"; // in addition to "random" can be set to any valid colour eg "#f0f" or "red"
let sparkles = 50;

/****************************
 *  Tinkerbell Magic Sparkle *
 *(c)2005-13 mf2fm web-design*
 *  http://www.mf2fm.com/rv  *
 ****************************/
let x = 400;
let ox = 400;
let y = 300;
let oy = 300;
let shigh = document.documentElement.clientHeight;
let sleft = 0;
let sdown = 0;
let tiny = [];
let star = [];
let starv = [];
let starx = [];
let stary = [];
let tinyx = [];
let tinyy = [];
let tinyv = [];

window.addEventListener("load", () => {
  let rats, rlef, rdow;
  for (let i = 0; i < sparkles; i++) {
    rats = createDiv(3, 3);
    rats.style.visibility = "hidden";
    rats.style.zIndex = "999";
    document.body.appendChild((tiny[i] = rats));
    starv[i] = 0;
    tinyv[i] = 0;
    rats = createDiv(5, 5);
    rats.style.backgroundColor = "transparent";
    rats.style.visibility = "hidden";
    rats.style.zIndex = "999";
    rlef = createDiv(1, 5);
    rdow = createDiv(5, 1);
    rats.appendChild(rlef);
    rats.appendChild(rdow);
    rlef.style.top = "2px";
    rlef.style.left = "0px";
    rdow.style.top = "0px";
    rdow.style.left = "2px";
    document.body.appendChild((star[i] = rats));
  }
  sparkle();
});

function sparkle() {
  let c;
  if (Math.abs(x - ox) > 1 || Math.abs(y - oy) > 1) {
    ox = x;
    oy = y;

    for (c = 0; c < sparkles; c++)
      if (!starv[c]) {
        const bgColor = colour == "random" ? newColour() : colour;
        star[c].childNodes[0].style.backgroundColor = bgColor;
        star[c].childNodes[1].style.backgroundColor = bgColor;

        starx[c] = x;
        stary[c] = y + 1;
        star[c].style.left = `${starx[c]}px`;
        star[c].style.top = `${stary[c]}px`;

        star[c].style.clip = "rect(0px, 5px, 5px, 0px)";
        star[c].style.visibility = "visible";
        starv[c] = 50;
        break;
      }
  }
  for (c = 0; c < sparkles; c++) {
    if (starv[c]) update_star(c);
    if (tinyv[c]) update_tiny(c);
  }
  setTimeout("sparkle()", 40);
}

function update_star(i) {
  if (--starv[i] == 25) star[i].style.clip = "rect(1px, 4px, 4px, 1px)";
  if (starv[i]) {
    stary[i] += 1 + Math.random() * 3;
    starx[i] += ((i % 5) - 2) / 5;
    if (stary[i] < shigh + sdown) {
      star[i].style.top = stary[i] + "px";
      star[i].style.left = starx[i] + "px";
    } else {
      star[i].style.visibility = "hidden";
      starv[i] = 0;
      return;
    }
  } else {
    tinyv[i] = 50;
    tiny[i].style.top = (tinyy[i] = stary[i]) + "px";
    tiny[i].style.left = (tinyx[i] = starx[i]) + "px";
    tiny[i].style.width = "2px";
    tiny[i].style.height = "2px";
    tiny[i].style.backgroundColor = star[i].childNodes[0].style.backgroundColor;
    star[i].style.visibility = "hidden";
    tiny[i].style.visibility = "visible";
  }
}

function update_tiny(i) {
  if (--tinyv[i] == 25) {
    tiny[i].style.width = "1px";
    tiny[i].style.height = "1px";
  }
  if (tinyv[i]) {
    tinyy[i] += 1 + Math.random() * 3;
    tinyx[i] += ((i % 5) - 2) / 5;
    if (tinyy[i] < shigh + sdown) {
      tiny[i].style.top = tinyy[i] + "px";
      tiny[i].style.left = tinyx[i] + "px";
    } else {
      tiny[i].style.visibility = "hidden";
      tinyv[i] = 0;
      return;
    }
  } else tiny[i].style.visibility = "hidden";
}

document.addEventListener("mousemove", (event) => {
  if (event) {
    y = event.pageY;
    x = event.pageX;
  } else {
    set_scroll();
    y = event.y + sdown;
    x = event.x + sleft;
  }
});

window.addEventListener("scroll", set_scroll);
function set_scroll() {
  if (typeof self.pageYOffset == "number") {
    sdown = self.pageYOffset;
    sleft = self.pageXOffset;
  } else if (
    document.body &&
    (document.body.scrollTop || document.body.scrollLeft)
  ) {
    sdown = document.body.scrollTop;
    sleft = document.body.scrollLeft;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollTop || document.documentElement.scrollLeft)
  ) {
    sleft = document.documentElement.scrollLeft;
    sdown = document.documentElement.scrollTop;
  } else {
    sdown = 0;
    sleft = 0;
  }
}

window.addEventListener(
  "resize",
  () => (shigh = document.documentElement.clientHeight)
);

function createDiv(height, width) {
  var div = document.createElement("div");
  div.style.position = "absolute";
  div.style.height = height + "px";
  div.style.width = width + "px";
  div.style.overflow = "hidden";
  return div;
}

function newColour() {
  var c = [];
  c[0] = 255;
  c[1] = Math.floor(Math.random() * 256);
  c[2] = Math.floor(Math.random() * (256 - c[1] / 2));
  c.sort(function () {
    return 0.5 - Math.random();
  });
  return "rgb(" + c[0] + ", " + c[1] + ", " + c[2] + ")";
}
