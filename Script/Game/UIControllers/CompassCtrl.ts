import { _decorator,
    Node,
    UIOpacity,
    EventTouch,
    Vec2,
    UITransform,
    v3,
    Vec3,
    find
} from 'cc';
import { OO_Component } from '../../OO/OO';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_COMPASS } from '../CEvent';
const { ccclass, property } = _decorator;

@ccclass('CompassCtrl')
export class CompassCtrl extends OO_Component {
    static instance: CompassCtrl = null;

    private _dishNode: Node = null;
    private _poleNode: Node = null;
    private _touching: boolean = false;
    // 阈值
    private _threshold: number = 0;

    vector: Vec3 = v3(0, 0, 0);

    protected onLoad(): void {
        super.onLoad();
        if (!CompassCtrl.instance) {
            CompassCtrl.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    start() {
        console.log('已挂载脚本CompassCtrl')
        this._dishNode = this.views["dish"];
        this._poleNode = this.views["dish/pole"];

        let dishWidth: number = this._dishNode.getComponent(UITransform).width;
        let poleWidth: number = this._poleNode.getComponent(UITransform).width;
        this._threshold = (dishWidth - poleWidth) / 2 + poleWidth / 6;

        this.node.on(Node.EventType.TOUCH_START, this._touchStart);
        this.node.on(Node.EventType.TOUCH_END, this._touchEnd);
        this.node.on(Node.EventType.TOUCH_MOVE, this._touchMove);
    }

    private _touchStart = (event: EventTouch) => {
        let loc: Vec2 = event.getUILocation();
        let pos: Vec3 = this.node.getComponent(UITransform).convertToNodeSpaceAR(v3(loc.x, loc.y));
        
        this._dishNode.getComponent(UIOpacity).opacity = 255;
        this._dishNode.setPosition(new Vec3(pos.x, pos.y));
        this._touching = true;

        EventBus.emit(CEVENT_COMPASS.TOUCH_START);
    }
    private _touchEnd = event => {
        this._dishNode.getComponent(UIOpacity).opacity = 0;

        let vec = new Vec3();
        this._poleNode.setPosition(vec);

        this._touching = false;
        this.vector = v3(0, 0, 0);

        EventBus.emit(CEVENT_COMPASS.TOUCH_END);
    }
    private _touchMove = event => {
        // 相对坐标
        let loc: Vec2 = event.getUILocation();
        let pos: Vec3 = this._dishNode.getComponent(UITransform).convertToNodeSpaceAR(v3(loc.x, loc.y));
        let vec = new Vec3(pos.x, pos.y);
        
        if (pos.x > this._threshold) {
            vec.x = this._threshold;
        }
        if (pos.x < -this._threshold) {
            vec.x = -this._threshold;
        }
        if (pos.y > this._threshold) {
            vec.y = this._threshold;
        }
        if (pos.y < -this._threshold) {
            vec.y = -this._threshold;
        }
        this._poleNode.setPosition(vec);
        this.vector = v3(this._poleNode.position).normalize();

        EventBus.emit(CEVENT_COMPASS.TOUCH_MOVE, this.vector);
    }

    public onTouchMove(vector: Vec3) {
        
    }

    update(deltaTime: number) {
        if (!this._touching) {
            return;
        }

        this.onTouchMove(this.vector);
    }
}
