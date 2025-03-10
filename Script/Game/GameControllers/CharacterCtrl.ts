import { _decorator, BoxCollider2D, CircleCollider2D, Component, Contact2DType, Node, Vec2, Vec3 } from 'cc';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_COMPASS } from '../CEvent';
import { OO_Component } from '../../OO/OO';
import CharacterManager from '../CManager/CharacterManager';
import { GP_UNIT, SCREEN_HEIGHT, SCREEN_WIDTH } from '../Common';
import { ChapterManager } from '../CManager/ChapterManager';
import { CTR_RIM, DROP_ITEM } from '../ColliderType';
import { CharacterPropManager, getCharacterPropValue } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

/**
 * 这里控制移动的是角色的外壳，并非角色本身，后续需要考虑是否会有问题
 */
@ccclass('CharacterCtrl')
export class CharacterCtrl extends OO_Component {
    private _moving: boolean = false;
    private _vector: Vec3 = null;
    private _pickRangeCollider: CircleCollider2D = null;

    private _selfCollider: BoxCollider2D = null;

    private _basePickRange: number = 0;
    private _baseSpd: number = 0;

    start() {
        EventBus.on(CEVENT_COMPASS.TOUCH_START, this._compassTouchStart, this);
        EventBus.on(CEVENT_COMPASS.TOUCH_END, this._compassTouchEnd, this);
        EventBus.on(CEVENT_COMPASS.TOUCH_MOVE, this._compassTouchMove, this);

        this._pickRangeCollider = this.node.children[0].getComponent(CircleCollider2D);

        this._basePickRange = CharacterPropManager.instance.baseProp.pick_range;
        this._baseSpd = CharacterPropManager.instance.baseProp.spd;
        let increasePickRange: number = getCharacterPropValue("pick_range");
        this._pickRangeCollider.radius = (this._basePickRange + (this._basePickRange * increasePickRange)) * GP_UNIT;
        this._pickRangeCollider.on(Contact2DType.BEGIN_CONTACT, this._onPickDomainBeginContact, this);

        this._selfCollider = this.node.children[0].getComponent(BoxCollider2D);
        this._selfCollider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
    }

    private _onPickDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (!ChapterManager.instance.onPlaying) {
            return;
        }
        if (selfCollider.tag === CTR_RIM.EXP_PICK) {
            switch (otherCollider.tag) {
                case DROP_ITEM.EXP: {
                    otherCollider.node.OO_param2 = true;
                } break;
                
                default:
                    break;
            }
        }
    }

    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        switch (otherCollider.tag) {
            case DROP_ITEM.TROPHY: {
                otherCollider.node.OO_param2 = true;
            } break;
        }
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
        
        let spd = this._baseSpd + getCharacterPropValue("spd") * this._baseSpd;
        let speed = dt * spd * GP_UNIT;
        let newPosition = this.node.position.add(new Vec3(this._vector.x * speed, this._vector.y * speed));

        let thresholdX = SCREEN_WIDTH / 2;
        let thresholdY = SCREEN_HEIGHT / 2;
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

        this._pickRangeCollider.off(Contact2DType.BEGIN_CONTACT, this._onPickDomainBeginContact, this);
    }

    update(deltaTime: number) {
        if (!ChapterManager.instance.onPlaying) {
            return;
        }
        if (this._moving) {
            this._move(deltaTime);
        }
        CharacterManager.instance.setCharacterLoc(this.node.position)
    }
}


