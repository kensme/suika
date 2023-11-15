// in px
// container width = 313
// container height = 351

// meters
const BOX_WIDTH = 30 / 100;
const BOX_HEIGHT = 40 / 100;
const BOX_WALL_THICKNESS = 1.0 / 100;

const offset = { x: 0.2, y: 0.01 };

export function createWorld(RAPIER: typeof import('@dimforge/rapier2d')) {
    const gravity = { x: 0.0, y: 1 };
    const world = new RAPIER.World(gravity);
    // const offset = { x: 100.0, y: 50.0 };

    const ground = RAPIER.ColliderDesc.cuboid(BOX_WIDTH / 2, BOX_WALL_THICKNESS);
    ground.translation = {
        x: BOX_WIDTH / 2 + offset.x,
        y: BOX_HEIGHT + BOX_WALL_THICKNESS + offset.y
    };
    world.createCollider(ground);

    const leftWall = RAPIER.ColliderDesc.cuboid(BOX_WALL_THICKNESS, BOX_HEIGHT / 2);
    leftWall.translation = { 
        x: offset.x + BOX_WALL_THICKNESS, 
        y: BOX_HEIGHT / 2 + offset.y 
    };
    world.createCollider(leftWall);

    const rightWall = RAPIER.ColliderDesc.cuboid(BOX_WALL_THICKNESS, BOX_HEIGHT / 2);
    rightWall.translation = { 
        x: BOX_WIDTH + offset.x - BOX_WALL_THICKNESS, 
        y: BOX_HEIGHT / 2 + offset.y 
    };
    world.createCollider(rightWall);

    return world;
}

export const DROP_Y = offset.y;

export const PX_PER_METER = 45 * 100;