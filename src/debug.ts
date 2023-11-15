import type { DebugRenderBuffers } from "@dimforge/rapier2d";
import { Graphics } from "pixi.js";
import { getConfigFileParsingDiagnostics } from "typescript";

class DebugRender extends Graphics {
    constructor() {
        super();
        this.zIndex = 10000;
    }
    debug(buffer: DebugRenderBuffers) {
        this.clear();
        this.lineStyle(0.001, 0xff00ff, 1);
        for(let i = 0; i < buffer.vertices.length; i += 4) {
            const x1 = buffer.vertices[i];
            const y1 = buffer.vertices[i + 1];
            const x2 = buffer.vertices[i + 2];
            const y2 = buffer.vertices[i + 3];
            this.moveTo(x1, y1);
            this.lineTo(x2, y2);
        }
    }
}

export default DebugRender;