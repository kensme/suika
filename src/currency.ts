import RAPIER, { RigidBody, type World } from '@dimforge/rapier2d';
import { BaseTexture, Sprite } from 'pixi.js';
import type { Context } from './game';

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


const SCALE = 1;
export function createCurrencyPreview(def: typeof currency[number], context: Context) {
    const sprite = Sprite.from(def.texture);
    const baseScale = 0.2;
    const scaleIncrement = 0.1;
    const SCALE = baseScale + (scaleIncrement * currency.indexOf(def));
    sprite.scale.set(SCALE);
    sprite.anchor.set(def.origin[0], def.origin[1]);
    context.app.stage.addChild(sprite);
    return sprite;
}

export function createCurrency(def: typeof currency[number], context: Context ) {
    // const SCALE = 0.2 + (0.1 * currency.indexOf(def));
    // const texture = BaseTexture.from(def.img);
    const baseScale = 0.2;
    const scaleIncrement = 0.1;
    const SCALE = baseScale + (scaleIncrement * currency.indexOf(def));
    const sprite = Sprite.from(def.texture);
    sprite.scale.set(SCALE);
    sprite.anchor.set(def.origin[0], def.origin[1]);
    const rigidBodyDesc = context.RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0);
    const rigidBody = context.world.createRigidBody(rigidBodyDesc);

    const colliderDesc = context.RAPIER.ColliderDesc.ball(def.texture.width / 2 * SCALE);
    const collider = context.world.createCollider(colliderDesc, rigidBody);
    collider.setTranslation(
        {x: def.origin[0] * def.texture.width * SCALE, y: def.origin[1] * def.texture.height * SCALE}
    );

    context.app.stage.addChild(sprite);

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