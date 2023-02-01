/**
 * Fairy dust cursor trail 🥹🥹🥹🥹
 *
 * Snatched from:
 * https://github.com/tholman/cursor-effects/blob/433675ed6dfb865b3342e65622ff4ede37cae51b/src/fairyDustCursor.js
 */

type Options = {
  colors: string[];
  element: HTMLElement;
};

class Particle {
  initialLifeSpan: number;
  lifeSpan: number;
  velocity: { x: number; y: number };
  position: { x: number; y: number };
  canv: HTMLCanvasElement;
  update: (context: CanvasRenderingContext2D) => void;

  constructor(x: number, y: number, canvasItem: HTMLCanvasElement) {
    const lifeSpan = 20;
    this.initialLifeSpan = lifeSpan; //
    this.lifeSpan = lifeSpan; //ms
    this.velocity = {
      x: (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2,
      y: Math.random() * 0.7 + 0.9 + 3,
    };
    this.position = { x: x, y: y };
    this.canv = canvasItem;

    this.update = function (context: CanvasRenderingContext2D) {
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      this.lifeSpan--;

      this.velocity.y += 0.02;

      const scale = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

      context.drawImage(
        this.canv,
        this.position.x - this.canv.width * scale,
        this.position.y - this.canv.height,
        this.canv.width,
        this.canv.height
      );
    };
  }
}

export function fairyDustCursor(options?: Options) {
  let possibleColors = (options && options.colors) || [
    "#2c88ad",
    "#5caaca",
    "#98d0e6",
  ];
  let hasWrapperEl = options && options.element;
  let element: HTMLElement = hasWrapperEl || document.documentElement;

  let width = window.innerWidth;
  let height = window.innerHeight;
  const cursor = { x: width / 2, y: width / 2 };
  const lastPos = { x: width / 2, y: width / 2 };
  const particles: Particle[] = [];
  const canvImages: HTMLCanvasElement[] = [];
  let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D;

  const char = "+";

  let previousTimeStamp: number | undefined;

  function init() {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d")!;
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.pointerEvents = "none";

    if (hasWrapperEl) {
      canvas.style.position = "absolute";
      element.appendChild(canvas);
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.style.position = "fixed";
      element.appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
    }

    context.font = "15px serif";
    context.textBaseline = "middle";
    context.textAlign = "center";

    possibleColors.forEach((color: string | CanvasGradient | CanvasPattern) => {
      let measurements = context.measureText(char);
      let bgCanvas = document.createElement("canvas");
      let bgContext = bgCanvas.getContext("2d")!;

      bgCanvas.width = measurements.width;
      bgCanvas.height =
        measurements.actualBoundingBoxAscent +
        measurements.actualBoundingBoxDescent;

      bgContext.fillStyle = color;
      bgContext.textAlign = "center";
      bgContext.font = "21px serif";
      bgContext.textBaseline = "middle";
      bgContext.fillText(
        char,
        bgCanvas.width / 2,
        measurements.actualBoundingBoxAscent
      );

      canvImages.push(bgCanvas);
    });

    bindEvents();
    loop();
  }

  // Bind events that are needed
  function bindEvents() {
    element.addEventListener("mousemove", onMouseMove);
    element.addEventListener("touchmove", onTouchMove, { passive: true });
    element.addEventListener("touchstart", onTouchMove, { passive: true });
    window.addEventListener("resize", onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    if (hasWrapperEl) {
      canvas.width = element.clientWidth;
      canvas.height = element.clientHeight;
    } else {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(
          e.touches[i].clientX,
          e.touches[i].clientY,
          canvImages[Math.floor(Math.random() * canvImages.length)]
        );
      }
    }
  }

  function onMouseMove(e: { clientX: number; clientY: number }) {
    window.requestAnimationFrame(() => {
      if (hasWrapperEl) {
        const boundingRect = element.getBoundingClientRect();
        cursor.x = e.clientX - boundingRect.left;
        cursor.y = e.clientY - boundingRect.top;
      } else {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
      }

      const distBetweenPoints = Math.hypot(
        cursor.x - lastPos.x,
        cursor.y - lastPos.y
      );

      if (distBetweenPoints > Math.random() * 100) {
        addParticle(
          cursor.x,
          cursor.y,
          canvImages[Math.floor(Math.random() * possibleColors.length)]
        );

        lastPos.x = cursor.x;
        lastPos.y = cursor.y;
      }
    });
  }

  function addParticle(x: number, y: number, color: HTMLCanvasElement) {
    particles.push(new Particle(x, y, color));
  }

  function updateParticles() {
    context.clearRect(0, 0, width, height);

    // Update
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(context);
    }

    // Remove dead particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].lifeSpan < 0) {
        particles.splice(i, 1);
      }
    }
  }

  function loop(timestamp?: number) {
    if (!previousTimeStamp || (timestamp && timestamp - previousTimeStamp > 40)) {
      updateParticles();
      previousTimeStamp = timestamp;
    }
    requestAnimationFrame(loop);
  }

  init();
}
