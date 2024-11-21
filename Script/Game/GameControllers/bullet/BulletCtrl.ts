import { _decorator, Component, Node, v3, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { BulletAttr, BulletInitParams } from '../../Interface';
import { getDistance, GP_UNIT } from '../../Common';
const { ccclass, property } = _decorator;

@ccclass('BulletCtrl')
export class BulletCtrl extends OO_Component {
    private _init: boolean = false;

    private _attr: BulletAttr = null;
    // 最大距离
    private _maxDisPx: number = null;
    // private _curDisPx: number = 0;
    private _vector: Vec3 = null;

    // 起点位置（相对）
    private _startRlt: Vec3 = null;

    protected onLoad(): void {
        super.onLoad();
    }

    start() {
    }

    initAttr({ attr, vector }: BulletInitParams) {
        this._attr = attr;
        this._vector = vector;
        this._maxDisPx = attr.maxDis * GP_UNIT;
        // 子弹运动
        this._init = true;

        // 初始位置
        let { x, y } = this.node.position;
        this._startRlt = new Vec3(x, y);
    }

    update(dt: number) {
        if (!this._init) {
            return;
        }
        let ax = dt * this._attr.speed * this._vector.x * GP_UNIT;
        let ay = dt * this._attr.speed * this._vector.y * GP_UNIT;
        let { x, y } = this.node.position;
        let newLoc = v3(x + ax, y + ay);
        // TODO: 如果两点之间距离超过_maxDisPx，销毁
        if (getDistance(this._startRlt, newLoc) < this._maxDisPx) {
            this.node.setPosition(newLoc);
        } else {
            this.node.destroy();
        }
    }
}


