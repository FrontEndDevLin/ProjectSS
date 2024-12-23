import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_COMPASS } from '../CEvent';
import { OO_Component } from '../../OO/OO';
import { CharacterAttribute } from '../Interface';
import CharacterManager from '../CManager/CharacterManager';
import { GP_UNIT } from '../Common';
const { ccclass, property } = _decorator;

/**
 * 这里控制移动的是角色的外壳，并非角色本身，后续需要考虑是否会有问题
 */
@ccclass('CharacterCtrl')
export class CharacterCtrl extends OO_Component {
    private _moving: boolean = false;
    private _vector: Vec3 = null;

    // 保存一个属性副本，此属性由CharacterManager维护，不可在该类中修改
    public attribute: any = CharacterManager.instance.attribute;

    start() {
        EventBus.on(CEVENT_COMPASS.TOUCH_START, this._compassTouchStart, this);
        EventBus.on(CEVENT_COMPASS.TOUCH_END, this._compassTouchEnd, this);
        EventBus.on(CEVENT_COMPASS.TOUCH_MOVE, this._compassTouchMove, this);
    }

    private _compassTouchStart() {
        this._moving = true;
    }
    private _compassTouchEnd() {
        this._moving = false;
        this._vector = null;
    }
    private _compassTouchMove(vector: Vec3) {
        this._vector = vector;
    }
    private _move(dt: number) {
        if (!this._vector) {
            return
        }
        // x < 0 摇杆向左，人物朝向向左
        // if (this._vector.x < 0) {
        //     this.views["SF"].scaleX = -1;
        // } else {
        //     this.views["SF"].scaleX = 1;
        // }

        let speed = dt * this.attribute.panel.spd * GP_UNIT;
        let newPosition = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));

        let thresholdX = 720 / 2;
        let thresholdY = 1280 / 2;
        // 判断边界值
        if (newPosition.x > thresholdX) {
            newPosition.x = thresholdX;
        }
        if (newPosition.y > thresholdY) {
            newPosition.y = thresholdY;
        }
        if (newPosition.x < -thresholdX) {
            newPosition.x = -thresholdX;
        }
        if (newPosition.y < -thresholdY) {
            newPosition.y = -thresholdY;
        }
        this.node.setPosition(newPosition);
    }

    protected onDestroy(): void {
        EventBus.off(CEVENT_COMPASS.TOUCH_START, this._compassTouchStart, this);
        EventBus.off(CEVENT_COMPASS.TOUCH_END, this._compassTouchEnd, this);
        EventBus.off(CEVENT_COMPASS.TOUCH_MOVE, this._compassTouchMove, this);
    }

    update(deltaTime: number) {
        if (this._moving) {
            this._move(deltaTime);
        }
        CharacterManager.instance.setCharacterLoc(this.node.position)
    }
}


