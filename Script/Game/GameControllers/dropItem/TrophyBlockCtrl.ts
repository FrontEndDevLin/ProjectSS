import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { TROPHY_TYPE } from '../../CManager/DropItemManager';
import CharacterManager from '../../CManager/CharacterManager';
import { getDistance, GP_UNIT } from '../../Common';
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

    private _pickUp(dt: number) {
        if (this._droping) {
            return;
        }
        let absorbing: boolean = this.node.OO_param2;
        if (!absorbing) {
            return;
        }

        let crtLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
        let nodeLoc: Vec3 = this.node.position;
        let dis: number = getDistance(nodeLoc, crtLoc);
        if (dis <= 3) {
            console.log('TODO: 战利品被捡起!');
            this.node.destroy();
            return;
        }

        let speed = dt * 10 * GP_UNIT;
        let vector: Vec3 = v3(crtLoc.x - nodeLoc.x, crtLoc.y - nodeLoc.y).normalize();
        let newPos: Vec3 = nodeLoc.add(new Vec3(vector.x * speed, vector.y * speed));
        this.node.setPosition(newPos);
    }

    public recovery() {
        this._droping = false;
        this.node.OO_param2 = true;
    }

    update(dt: number) {
        this._pickUp(dt);
    }
}

