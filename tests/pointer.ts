import { strict as assert } from 'node:assert';
import { World } from '../src/world';
Math.random = () => 0.5;
function setup(distance: number, active: boolean) {
  const world = new World([{ kind: 'classic', size: 1 }], 1);
  world.resize(1200, 800, 4, 6);
  world.fish = [];
  const shark = world.sharks[0];
  const x = 300, y = 250;
  shark.heading = 0;
  shark.speed = 40;
  shark.hunger = 0;
  shark.retargetAt = Infinity;
  for (let i = 0; i < shark.nodes.length / 2; i++) {
    shark.nodes[i * 2] = x - i * shark.length / 19;
    shark.nodes[i * 2 + 1] = y;
  }
  world.pointer = { x, y: y + shark.length * distance, active };
  return { world, shark };
}
const near = setup(1.5, true);
const far = setup(2.5, true);
const inactive = setup(1.5, false);
for (let i = 0; i < 30; i++) { near.world.step(1 / 60); far.world.step(1 / 60); inactive.world.step(1 / 60); }
assert.ok(near.shark.heading > inactive.shark.heading + 0.2, 'nearby pointer attracts the shark');
assert.ok(Math.abs(far.shark.heading - inactive.shark.heading) < 0.0001, 'distant pointer has no effect');
for (let i = 0; i < 240; i++) near.world.step(1 / 60);
const cruise = 30 + near.shark.length * 0.04;
assert.ok(near.shark.speed > cruise * 1.9, "shark accelerates to twice its normal speed near the pointer");
for (let i = 0; i < 360; i++) near.world.step(1 / 60);
const d = Math.hypot(near.shark.nodes[0] - near.world.pointer.x, near.shark.nodes[1] - near.world.pointer.y);
assert.ok(d < near.shark.length * 1.5, `shark stays near the pointer, distance ${d}`);
near.world.pointer.active = false;
for (let i = 0; i < 360; i++) near.world.step(1 / 60);
assert.ok(Math.abs(near.shark.speed - cruise) < cruise * 0.02, 'shark returns to cruise speed when pointer is inactive');
console.log('attraction, threshold, orbit, doubled speed, and return to cruise: passed');
