import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('ExpBlockCtrl')
export class ExpBlockCtrl extends OO_Component {
    // 掉落中，动画过程不可被拾取
    private _droping: boolean = true;
    // 被吸收中，此时再无碰撞体积
    private _absorbing: boolean = false;

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
                this._droping = false;
            })
        .start();
    }

    /**
     * 被角色吸收
     */
    public absorb() {
        // 吸走动画，每一帧检测角色位置朝角色位移，直到与角色位置小于5px，销毁
        this._absorbing = true;
    }

    update(dt: number) {
        if (!this._absorbing) {
            return;
        }
        
    }
}


