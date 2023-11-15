import RAPIER, { RigidBody, type World } from '@dimforge/rapier2d';
import { BaseTexture, Sprite } from 'pixi.js';
import type { Context } from './game';
import { PX_PER_METER } from './world';

export const currency = [
    {
        name: 'transmutation',
        img: 'transmutation.png',
        origin: [0.5, 37/59]
    },
    {
        name: 'augmentation',
        img: 'augmentation.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'alteration',
        img: 'alteration.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'chance',
        img: 'chance.png',
        origin: [0.5, 35/64]
    },
    {
        name: 'jeweller',
        img: 'jeweller.png',
        origin: [0.5, 0.5]
    },
    // {
    //     name: 'alchemy',
    //     img: 'alchemy.png',
    //     origin: [0.5, 46/67]
    // },
    {
        name: 'scouring',
        img: 'scouring.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'unmaking',
        img: 'unmaking.png',
        origin: [0.5, 0.5]
    },
    // {
    //     name: 'regret',
    //     img: 'regret.png',
    //     origin: [0.5, 0.5]
    // },
    {
        name: 'chaos',
        img: 'chaos.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'exalted',
        img: 'exalted.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'divine',
        img: 'divine.png',
        origin: [0.5, 0.5]
    },
    {
        name: 'mirror',
        img: 'mirror.png',
        origin: [0.5, 0.5]
    }
].map((cur, i) => ({
    ...cur,
    index: i,
    texture: BaseTexture.from(cur.img),
}));

export type Currency = {
    sprite: Sprite,
    rigidBody: RigidBody,
    name: string,
    index: number,
    remove: () => void
}


const SCALE = 1 / PX_PER_METER;

const BASE_SCALE = 1.0; // min size, scales all
const SCALE_INCREMENT = 0.5; // scales based on index

export function createCurrencyPreview(def: typeof currency[number], context: Context) {
    const sprite = Sprite.from(def.texture);
    const scale = BASE_SCALE + (SCALE_INCREMENT * currency.indexOf(def));

    const incrementedScale = SCALE * scale;
    //const incrementedScale = SCALE * currency.indexOf(def);
    sprite.scale.set(incrementedScale);
    sprite.anchor.set(def.origin[0], def.origin[1]);
    context.app.stage.addChild(sprite);
    return sprite;
}

export function createCurrency(def: typeof currency[number], context: Context ) {
    const scale = BASE_SCALE + (SCALE_INCREMENT * currency.indexOf(def));

    const incrementedScale = SCALE * scale;

    /* sprite */
    const sprite = Sprite.from(def.texture);
    sprite.scale.set(incrementedScale);
    sprite.anchor.set(def.origin[0], def.origin[1]);
    context.app.stage.addChild(sprite);

    /* rigid body */
    const rigidBodyDesc = context.RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0);
    const rigidBody = context.world.createRigidBody(rigidBodyDesc);

    /* collider */
    const colliderDesc = context.RAPIER.ColliderDesc.ball(def.texture.width / 2 * incrementedScale);
    const collider = context.world.createCollider(colliderDesc, rigidBody);
    collider.setTranslation(
        {x: def.origin[0] * def.texture.width * incrementedScale, y: def.origin[1] * def.texture.height * incrementedScale}
    );


    collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    
    return ({ 
        sprite, 
        rigidBody,
        name: 
        def.name, 
        index: currency.indexOf(def),
        remove: () => {
            context.world.removeRigidBody(rigidBody);
            context.app.stage.removeChild(sprite);
        }
    });
}