import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('ExpBlockCtrl')
export class ExpBlockCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        const targetVec: Vec3 = this.node.OO_param1;
        // console.log(targetVec);

        tween(this.node).to(
            0.1,
            { position: targetVec }
        ).start();
    }

    update(deltaTime: number) {
        
    }
}


