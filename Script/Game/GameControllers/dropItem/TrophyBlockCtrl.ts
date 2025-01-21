import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { TROPHY_TYPE } from '../../CManager/DropItemManager';
const { ccclass, property } = _decorator;

@ccclass('TrophyBlockCtrl')
export class TrophyBlockCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        const targetVec: Vec3 = this.node.OO_param1;
        const quality: number = this.node.OO_param2;

        switch (quality) {
            case TROPHY_TYPE.NORMAL: {

            } break;
            case TROPHY_TYPE.CHESS: {

            } break;
            case TROPHY_TYPE.GREAT_CHESS: {

            } break;
        }

        if (!targetVec) {
            return;
        }

        tween(this.node)
            .to(0.1, { position: targetVec })
            .call(() => {

            })
            .start();
    }

    update(deltaTime: number) {
        
    }
}


