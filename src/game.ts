import type { DebugRenderBuffers, World } from "@dimforge/rapier2d";
import { Application, Graphics, Sprite } from "pixi.js";
import DebugRender from "./debug";
import { currency, createCurrency, createCurrencyPreview, type Currency } from "./currency";
import { createWorld, DROP_Y, PX_PER_METER } from "./world";

const app = new Application({
    background: '#1099bb',
    resizeTo: window,
    view: document.getElementById('game-canvas') as HTMLCanvasElement,
});

app.stage.scale.set(PX_PER_METER / 3);

const debugRender = new DebugRender();
app.stage.addChild(debugRender);

app.stage.sortChildren();

let currentScore = 0;
const scoreValues = currency.map((_, i) => 2 * (i + 1));

function updateScoreDisplay(score: number) {
    const scoreDisplay = document.getElementById('scoreDisplay');
    if(!scoreDisplay) return console.error('scoreDisplay not found')
    scoreDisplay.textContent = `Score: ${score}`
}

updateScoreDisplay(currentScore);

import('@dimforge/rapier2d').then(async RAPIER => {
    const world = createWorld(RAPIER);
    const eventQueue = new RAPIER.EventQueue(true);
    
    world.debugRender();

    const context = {
        RAPIER,
        world,
        app,
    };

    const objects: Currency[] = [];
    
    const objectMap = new Map();

    // Initialize current and next currencies
    let currentCurrencyIndex = Math.floor(Math.random() * 4);
    let nextCurrencyIndex = Math.floor(Math.random() * 4);
    let currentCurrency = currency[currentCurrencyIndex];
    let nextCurrency = currency[nextCurrencyIndex];

    // Function to update the current and next currency
    function updateCurrencies() {
        currentCurrencyIndex = nextCurrencyIndex;
        nextCurrencyIndex = Math.floor(Math.random() * 4);

        currentCurrency = currency[currentCurrencyIndex];
        nextCurrency = currency[nextCurrencyIndex];
    }

    // html image for next currency
    const nextCurrencyDisplay = document.getElementById('nextCurrencyDisplay') as HTMLImageElement;

    nextCurrencyDisplay.src = nextCurrency.img;
    // Function to update the next currency display
    function updateNextCurrencyDisplay(nextCurrency: typeof currency[number]) {
        nextCurrencyDisplay.src = nextCurrency.img;
    }

    let dropPreviewSprite = createCurrencyPreview(currentCurrency, context);
    app.view.addEventListener!('mousemove', (event) => {
        const mousePosX = app.renderer.events.pointer.x / app.stage.scale.x;
        // const dropX = mousePosX < 100 + 25 ? 100 + 25 : mousePosX > 413 - 25 ? 413 - 25 : mousePosX;
        const dropX = mousePosX;
        dropPreviewSprite.position.set(dropX, DROP_Y);
    }); 

    app.view.addEventListener!('pointerup', async () => {
        const nextCurrencyObj = createCurrency(currentCurrency, context);
        const mousePosX = app.renderer.events.pointer.x / app.stage.scale.x;
        // const dropX = mousePosX < 100 + 25 ? 100 + 25 : mousePosX > 413 - 25 ? 413 - 25 : mousePosX;
        const dropX = mousePosX;
        nextCurrencyObj.rigidBody.setTranslation({x: dropX, y: DROP_Y}, true);
        objectMap.set(nextCurrencyObj.rigidBody.collider(0).handle, nextCurrencyObj);
        objects.push(nextCurrencyObj);

        if(dropPreviewSprite){ 
            dropPreviewSprite.destroy();
            dropPreviewSprite = createCurrencyPreview(nextCurrency, context);
            dropPreviewSprite.position.set(dropX, DROP_Y);
        }

        // Update current and next currency
        updateCurrencies();
    
        updateNextCurrencyDisplay(nextCurrency);
    });

    app.ticker.add((delta) => {
        world.step(eventQueue);

        eventQueue.drainCollisionEvents(async (handle1, handle2, started) => {
            if(!started) return;
                const a = objectMap.get(handle1);
                const b = objectMap.get(handle2);
                if(!a || !b || a.index !== b.index) return;
                const midpointX = (a.rigidBody.translation().x + b.rigidBody.translation().x) / 2;
                const midpointY = (a.rigidBody.translation().y + b.rigidBody.translation().y) / 2;
                const nextCurrency = currency[a.index + 1];
                if(!nextCurrency) return;
                a.remove();
                b.remove();
                objects.splice(objects.indexOf(a), 1);
                objects.splice(objects.indexOf(b), 1);
                objectMap.delete(handle1);
                objectMap.delete(handle2);
                const nextCurrencyObj = createCurrency(nextCurrency, context);
                nextCurrencyObj.rigidBody.setTranslation({x: midpointX, y: midpointY}, true);
                objectMap.set(nextCurrencyObj.rigidBody.collider(0).handle, nextCurrencyObj);
                objects.push(nextCurrencyObj);

                currentScore += scoreValues[a.index];
                updateScoreDisplay(currentScore);
        });

        for(const { sprite, rigidBody } of objects) {
            const pos = rigidBody.translation();
            sprite.position.set(pos.x, pos.y);
            const rotation = rigidBody.rotation();
            sprite.rotation = rotation;
        }
        debugRender.debug(world.debugRender());
    });



});

export type Context = {
    RAPIER: typeof import('@dimforge/rapier2d'),
    world: World,
    app: Application,
};

document.body.appendChild(app.view as unknown as Node);
