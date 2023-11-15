export function createWorld(RAPIER: typeof import('@dimforge/rapier2d')) {
    const gravity = { x: 0.0, y: 9.81 * 10 * 2};
    const world = new RAPIER.World(gravity);

    const offset = { x: 100.0, y: 50.0 };

    const ground = RAPIER.ColliderDesc.cuboid(313 / 2, 10.0);
    ground.translation = { x: 313.0 / 2 + offset.x, y: 351.0 + 10 + offset.y};
    world.createCollider(ground);

    const leftWall = RAPIER.ColliderDesc.cuboid(10.0, 351.0 / 2);
    leftWall.translation = { x: offset.x + 10, y: 351.0 / 2 + offset.y };
    world.createCollider(leftWall);

    const rightWall = RAPIER.ColliderDesc.cuboid(10.0, 351.0 / 2);
    rightWall.translation = { x: 313 + offset.x - 10, y: 351.0 / 2 + offset.y };
    world.createCollider(rightWall);

    return world;
}

export const DROP_Y = 55;