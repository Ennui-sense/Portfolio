import {
  Engine,
  Runner,
  Bodies,
  Composite,
  Mouse,
  MouseConstraint
} from "matter-js";

export function initPhysics() {
  const container = document.querySelector(".physics__container");

  const items = [...container.querySelectorAll(".physics__item")];

  const width = container.clientWidth;
  const height = container.clientHeight;

  const engine = Engine.create();
  engine.gravity.y = 0.5;

  const walls = [
    Bodies.rectangle(width / 2, height + 25, width, 50, { isStatic: true }),
    Bodies.rectangle(width / 2, -25, width, 50, { isStatic: true }),
    Bodies.rectangle(-25, height / 2, 50, height, { isStatic: true }),
    Bodies.rectangle(width + 25, height / 2, 50, height, { isStatic: true })
  ];

  const bodies = items.map((el) => {
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

  const runner = Runner.create();
  Runner.run(runner, engine);

  function render() {
    bodies.forEach((body) => {
      const { x, y } = body.position;

      body.el.style.transform = `
        translate(${x - body.el.offsetWidth / 2}px,
                  ${y - body.el.offsetHeight / 2}px)
        rotate(${body.angle}rad)
      `;
    });

    requestAnimationFrame(render);
  }

  render();
}
