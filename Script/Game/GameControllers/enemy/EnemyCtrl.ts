import { _decorator, Component, Node, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { EnemyManager } from '../../CManager/EnemyManager';
import CharacterManager from '../../CManager/CharacterManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyCtrl')
export class EnemyCtrl extends OO_Component {
    private _alive: boolean = true;

    start() {

    }

    protected onLoad(): void {
        super.onLoad();

        console.log("通用敌人脚本挂载")
    }

    update(deltaTime: number) {
        if (this._alive) {
            let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
            let cX = characterLoc.x;
            let cY = characterLoc.y;
            let { x, y } = this.node.position;
            let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
            EnemyManager.instance.updateEnemy(this.node.uuid, {
                alive: 1,
                dis,
                x,
                y
            });
        }
    }
}

