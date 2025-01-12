import { _decorator, Component, Label, Node, Vec3, Animation } from 'cc';
import { OO_Component } from '../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('DmgTxtCtrl')
export class DmgTxtCtrl extends OO_Component {
    private _time: number = 0.24;
    private _dead: boolean = false;

    start() {
        const param = this.node.OO_param1;
        let damage: string = param.damage;
        let position: Vec3 = param.position;

        this.node.getComponent(Label).string = `${damage}`;
        this.node.setPosition(position);
        this.node.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this._destory();
        });
    }

    private _destory() {
        this._dead = true;
    }

    update(dt: number) {
        if (!this._dead) {
            return;
        }

        this._time -= dt;
        if (this._time <= 0) {
            this.node.destroy();
        }
    }
}


