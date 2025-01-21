import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('ExpBlockCtrl')
export class ExpBlockCtrl extends OO_Component {
    private _moving: boolean = true;

    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        const targetVec: Vec3 = this.node.OO_param1;

        if (!targetVec) {
            return;
        }
        // console.log(targetVec);

        tween(this.node)
            .to(0.1, { position: targetVec })
            .call(() => {
                this._moving = false;
            })
        .start();
    }

    update(deltaTime: number) {
        
    }
}


