window.requestAnimationFrame =
  window.__requestAnimationFrame ||
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (function () {
    return function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

window.isDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
  (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
);

var loaded = false;

function init() {
  if (loaded) return;
  loaded = true;

  var canvas = document.getElementById("heart");
  var ctx = canvas.getContext("2d");
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function drawText() {
    const fontSize = Math.min(60, canvas.width / 10);
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "lightblue";
    ctx.textAlign = "center";
    ctx.fillText("I love you", canvas.width / 2, canvas.height / 2 + 100);
  }

  function heartPosition(rad) {
    return [
      Math.pow(Math.sin(rad), 3),
      -(
        15 * Math.cos(rad) -
        5 * Math.cos(2 * rad) -
        2 * Math.cos(3 * rad) -
        Math.cos(4 * rad)
      ),
    ];
  }

  function scaleAndTranslate(pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  }

  var pointsOrigin = [];
  var dr = 0.1;
  for (var i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 310, 19, 0, 0));
  
  var heartPointsCount = pointsOrigin.length;
  var targetPoints = [];

  function pulse(kx, ky) {
    for (var i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [
        kx * pointsOrigin[i][0] + canvas.width / 2,
        ky * pointsOrigin[i][1] + canvas.height / 2.2,
      ];
    }
  }

  var elements = [];
  for (var i = 0; i < heartPointsCount; i++) {
    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    elements[i] = {
      vx: 0,
      vy: 0,
      speed: Math.random() + 5,
      q: ~~(Math.random() * heartPointsCount),
      force: 0.2 * Math.random() + 0.7,
      trace: Array.from({ length: 50 }, () => ({ x, y })),
    };
  }

  var time = 0;

  function loop() {
    var n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += 0.6;

    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = elements.length; i--;) {
      var e = elements[i];
      var q = targetPoints[e.q];
      var dx = e.trace[0].x - q[0];
      var dy = e.trace[0].y - q[1];
      var length = Math.sqrt(dx * dx + dy * dy);

      if (length < 10) {
        e.q = ~~(Math.random() * heartPointsCount);
      }

      e.vx += (-dx / length) * e.speed;
      e.vy += (-dy / length) * e.speed;
      e.trace[0].x += e.vx;
      e.trace[0].y += e.vy;
      e.vx *= e.force;
      e.vy *= e.force;

      for (var k = 0; k < e.trace.length - 1; k++) {
        var T = e.trace[k];
        var N = e.trace[k + 1];
        N.x -= 0.4 * (N.x - T.x);
        N.y -= 0.4 * (N.y - T.y);
      }

      ctx.fillStyle = "rgba(51, 204, 255, 0.7)";
      e.trace.forEach((t) => ctx.fillRect(t.x, t.y, 1, 1));
    }

    drawText();
    window.requestAnimationFrame(loop);
  }

  loop();
}

document.addEventListener("DOMContentLoaded", init);
