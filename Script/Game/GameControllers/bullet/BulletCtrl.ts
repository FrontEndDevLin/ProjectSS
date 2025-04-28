import { _decorator, BoxCollider2D, Component, Contact2DType, Node, Sprite, v3, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { BulletAttr, BulletInitParams } from '../../Interface';
import { getDistance, GP_UNIT } from '../../Common';
import { GP_GROUP } from '../../ColliderType';
const { ccclass, property } = _decorator;

@ccclass('BulletCtrl')
export class BulletCtrl extends OO_Component {
    private _init: boolean = false;
    private _isDie: boolean = false;

    private _attr: BulletAttr = null;
    // 最大距离
    private _maxDisPx: number = null;
    // private _curDisPx: number = 0;
    private _vector: Vec3 = null;

    // 起点位置（相对）
    private _startRlt: Vec3 = null;

    protected onLoad(): void {
        super.onLoad();

        let collider: BoxCollider2D = this.node.getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
    }

    start() {
    }

    initAttr({ attr, vector }: BulletInitParams) {
        this._attr = attr;
        this._vector = vector;
        this._maxDisPx = attr.max_dis * GP_UNIT;
        // 子弹运动
        this._init = true;
        // 初始位置
        let { x, y } = this.node.position;
        this._startRlt = new Vec3(x, y);
    }

    private _die() {
        this._isDie = true;
        this.views["SF"].active = false;
        setTimeout(() => {
            this.node.destroy();
        }, 1000)
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        // console.log(otherCollider.group)
        // console.log(selfCollider.group)
        // if (otherCollider.group === GP_GROUP.BULLET) {
        //     console.log('被击中')
        // }
    }

    update(dt: number) {
        if (!this._init || this._isDie) {
            return;
        }
        let ax = dt * this._attr.speed * this._vector.x * GP_UNIT;
        let ay = dt * this._attr.speed * this._vector.y * GP_UNIT;
        let { x, y } = this.node.position;
        let newLoc = v3(x + ax, y + ay);
        // 如果两点之间距离超过_maxDisPx，销毁
        if (getDistance(this._startRlt, newLoc) < this._maxDisPx) {
            this.node.setPosition(newLoc);
        } else {
            this._die();
        }
    }
}


