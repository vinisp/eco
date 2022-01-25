const $navBarItems = document.querySelectorAll(".menuItem");
const $navBar = document.querySelector(".navBar");
const $cards = document.querySelectorAll(".card");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.documentElement.scrollTop > 80) {
    for (let i = 0; i < $navBarItems.length; i++) {
      /* $navBarItems[i].style.opacity = "0.2"; */
    }
    opacity = true;
    console.log();
    $navBar.style.height = "40px";
    $navBar.style.opacity = "0.4";
  } else {
    for (let i = 0; i < $navBarItems.length; i++) {
      $navBarItems[i].style.opacity = "1";
    }
    $navBar.style.height = "80px";
    $navBar.style.opacity = "1";
  }
}

function isVisible(element) {
  let elementBox = element.getBoundingClientRect();
  let distanceTop = -250;

  if (elementBox.top - window.innerHeight < distanceTop) {
    return true;
  } else {
    return false;
  }
}

function scanDocument() {
  let sectionList = document.querySelectorAll(".hidden");
  sectionList.forEach(function (section) {
    section.classList.remove("hidden");
  });
  $cards.forEach(function (section) {
    section.classList.add("show");
  });
}

document.addEventListener("scroll", scanDocument);

var w = (c.width = 400),
  h = (c.height = 450),
  ctx = c.getContext("2d"),
  opts = {
    speed: 1,
    splitSizeProbabilityMultiplier: 1 / 1000,
    maxIterations: 8,
    startSize: 20,
    baseSizeMultiplier: 0.7,
    addedSizeMultiplier: 0.2,
    baseAngleVariation: -Math.PI / 16,
    addedAngleVariation: Math.PI / 8,
    angleVariationIterationMultiplier: 0.8,

    baseLeafSize: 20,
    addedLeafSize: 15,

    rotYVel: 0.01,
    focalLength: 250,
    vanishPoint: {
      x: w / 2,
      y: h / 2,
    },
    translations: {
      x: 0,
      y: 200,
      z: 400,
    },
  },
  rotY = 0,
  rotYsin = 0,
  rotYcos = 1,
  lines = [];

function Line(parent) {
  this.iteration = parent.iteration + 1;
  this.start = parent.end;
  this.angle = {
    a:
      parent.angle.a +
      this.iteration *
        opts.angleVariationIterationMultiplier *
        (opts.baseAngleVariation + opts.addedAngleVariation * Math.random()),
    b:
      parent.angle.b +
      this.iteration *
        opts.angleVariationIterationMultiplier *
        (opts.baseAngleVariation + opts.addedAngleVariation * Math.random()),
  };
  this.size =
    (opts.baseSizeMultiplier + opts.addedSizeMultiplier * Math.random()) *
    parent.size;

  this.color = "hsla(hue,80%,50%,alp)"
    .replace("hue", (1 - this.iteration / opts.maxIterations) * 40)
    .replace("alp", 1 - (this.iteration / opts.maxIterations) * 0.9);

  var sinA = Math.sin(this.angle.a),
    sinB = Math.sin(this.angle.b),
    cosA = Math.cos(this.angle.a),
    cosB = Math.cos(this.angle.b);

  this.speed = {
    x: opts.speed * cosA * sinB,
    y: opts.speed * sinA * sinB,
    z: opts.speed * cosB,
  };

  this.end = this.closest = new Point(this.start.x, this.start.y, this.start.z);

  this.done = false;
  this.time = 0;
}
Line.prototype.update = function () {
  if (!this.done) {
    this.end.x += this.speed.x;
    this.end.y += this.speed.y;
    this.end.z += this.speed.z;

    this.time += 0.1;

    if (
      Math.random() < this.size * opts.splitSizeProbabilityMultiplier ||
      this.time > this.size
    ) {
      if (this.iteration < opts.maxIterations) {
        lines.push(new Line(this));
        lines.push(new Line(this));
      } else {
        lines.push(new Leaf(this));
      }

      this.done = true;
    }
  }

  // some lines can share their start
  if (this.start.hasntCalculatedScreen) this.start.calculateScreen();

  // but not their end
  this.end.calculateScreen();

  this.closest = this.start;
  if (this.end.transformed.z < this.start.transformed.z)
    this.closest = this.end;
};
Line.prototype.render = function () {
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.size * this.start.screen.scale;
  ctx.beginPath();
  ctx.moveTo(this.start.screen.x, this.start.screen.y);
  ctx.lineTo(this.end.screen.x, this.end.screen.y);
  ctx.stroke();

  this.start.hasntCalculatedScreen = this.end.hasntCalculatedScreen = true;
};

function Leaf(parent) {
  this.point = this.closest = parent.end;
  this.size = opts.baseLeafSize + opts.addedLeafSize * Math.random();
  this.time = -Math.PI / 2;
  this.speed = 0.03 + 0.03 * Math.random();
  this.color = "hsla(hue,80%,50%,.5)".replace("hue", 80 + 20 * Math.random());
}
Leaf.prototype.update = function () {
  this.time += this.speed;
};
Leaf.prototype.render = function () {
  ctx.fillStyle = this.color;
  var size =
    (Math.sin(this.time) / 2 + 0.5) * this.size * this.point.screen.scale;
  ctx.fillRect(
    this.point.screen.x - size / 2,
    this.point.screen.y - size / 2,
    size,
    size
  );
};

function Point(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;

  this.screen = {};
  this.transformed = {};
  this.hasntCalculatedScreen = true;
}
Point.prototype.calculateScreen = function () {
  var x = this.x,
    y = this.y,
    z = this.z;

  // rotate around Y
  var X = x;
  x = x * rotYcos - z * rotYsin;
  z = z * rotYcos + X * rotYsin;

  // translate
  x += opts.translations.x;
  y += opts.translations.y;
  z += opts.translations.z;

  // I only need the z for now
  this.transformed.z = z;

  this.screen.scale = opts.focalLength / z;
  this.screen.x = opts.vanishPoint.x + x * this.screen.scale;
  this.screen.y = opts.vanishPoint.y + y * this.screen.scale;

  this.hasntCalculatedScreen = false;
};

function anim() {
  window.requestAnimationFrame(anim);

  ctx.fillStyle = "#f2f2f2f2";
  ctx.fillRect(0, 0, w, h);

  rotY += opts.rotYVel;
  rotYcos = Math.cos(rotY);
  rotYsin = Math.sin(rotY);

  lines.map(function (line) {
    line.update();
  });
  lines.sort(function (a, b) {
    return b.closest.transformed.z - a.closest.transformed.z;
  });
  lines.map(function (line) {
    line.render();
  });
}

lines.push(
  new Line({
    end: new Point(0, 0, 0),
    angle: { a: Math.PI / 2, b: -Math.PI / 2 },
    size: opts.startSize,
    iteration: 0,
  })
);

anim();

window.addEventListener("click", function () {
  lines.length = 0;

  lines.push(
    new Line({
      end: new Point(0, 0, 0),
      angle: { a: Math.PI / 2, b: -Math.PI / 2 },
      size: opts.startSize,
      iteration: 0,
    })
  );
});
window.addEventListener("resize", function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;

  opts.vanishPoint.x = w / 2;
  opts.vanishPoint.y = h / 2;
});
