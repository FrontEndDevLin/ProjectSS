import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { TROPHY_TYPE } from '../../CManager/DropItemManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.targetVec 被爆出后，运动到的最终位置
 * OO_param1.quality 战利品品质
 * OO_param2 是否被捡起
 */
@ccclass('TrophyBlockCtrl')
export class TrophyBlockCtrl extends OO_Component {
    // 掉落中，动画过程不可被拾取
    private _droping: boolean = true;

    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        const prop1 = this.node.OO_param1;
        const targetVec: Vec3 = prop1.targetVec;
        const quality: number = prop1.quality;

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
                this._droping = false;
            })
            .start();
    }

    private _pickUp() {
        if (this._droping) {
            return;
        }
        let isBeenPickUp: boolean = this.node.OO_param2;
        if (isBeenPickUp) {
            console.log('TODO: 战利品被捡起!');
            this.node.destroy();
        }
    }

    update(dt: number) {
        this._pickUp();
    }
}


