import {
  Engine,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint
} from "matter-js";

let engine = null;
let runner = null;
let bodies = [];
let container = null;


// Инициализируем физику
export function initPhysics() {
	// Случай, когда физика уже была запущена
  if (engine) return; 

  container = document.querySelector(".physics__container");

  const items = [...container.querySelectorAll(".physics__item")];
  if (!items.length) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  engine = Engine.create();
  engine.gravity.y = 0.5;

  const walls = [
    Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
    Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
    Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
    Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true })
  ];

  bodies = items.map((el) => {
    const rect = el.getBoundingClientRect();

    const body = Bodies.rectangle(
      Math.random() * width,
      Math.random() * height,
      rect.width,
      rect.height,
      {
        restitution: 0.4,
        friction: 0.2,
        frictionAir: 0.02
      }
    );

    body.el = el;
    el.style.position = "absolute";
    return body;
  });

  Composite.add(engine.world, [...walls, ...bodies]);

  const mouse = Mouse.create(container);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  });

  Composite.add(engine.world, mouseConstraint);

  runner = Runner.create();
  Runner.run(runner, engine);

  requestAnimationFrame(update);
}

function update() {
  if (!engine) return;

  bodies.forEach((body) => {
    const { x, y } = body.position;

    body.el.style.transform = `
      translate(${x - body.el.offsetWidth / 2}px,
                ${y - body.el.offsetHeight / 2}px)
      rotate(${body.angle}rad)
    `;
  });

  requestAnimationFrame(update);
}


// Останавливаем физику
export function stopPhysics() {
  if (!engine) return;

  Runner.stop(runner);
  Composite.clear(engine.world, false);

  bodies.forEach((body) => {
    body.el.style.transform = "";
    body.el.style.position = "";
  });

  engine = null;
  runner = null;
  bodies = [];
}
