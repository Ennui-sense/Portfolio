import { initPhysics, stopPhysics } from "./physics";

function checkPhysics() {
  if (window.innerWidth >= 1440) {
    initPhysics();
  } else {
    stopPhysics();
  }
}

window.addEventListener("DOMContentLoaded", checkPhysics);
window.addEventListener("resize", checkPhysics);
