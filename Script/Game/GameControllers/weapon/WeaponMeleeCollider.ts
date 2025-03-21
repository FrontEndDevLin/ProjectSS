import { _decorator, BoxCollider2D, Component, Node, Size, UITransform, v2 } from 'cc';
import { GP_GROUP } from '../../ColliderType';
const { ccclass, property } = _decorator;

@ccclass('WeaponMeleeCollider')
export class WeaponMeleeCollider extends Component {
    private _collider: BoxCollider2D = null;

    protected onLoad(): void {
        let nodeSize: Size = this.node.OO_param1.nodeSize;
        let tag: number = this.node.OO_param1.colliderTag;

        let wpColliderNode: Node = new Node("WpCollider");
        this.node.addChild(wpColliderNode);

        let uiTransform = wpColliderNode.addComponent(UITransform);
        this._collider = wpColliderNode.addComponent(BoxCollider2D);

        this._collider.group = GP_GROUP.BULLET;
        this._collider.tag = tag;

        uiTransform.contentSize = nodeSize;
        uiTransform.anchorPoint = v2(0.5, 0.5);
        this._collider.size = nodeSize;
        this._collider.enabled = false;
    }

    start() {

    }

    public intoAtkFrame() {
        console.log('进入攻击判定帧')
        this._collider.enabled = true;
    }
    public endAtkFrame() {
        console.log('离开攻击判定帧')
        this._collider.enabled = false;
    }

    update(deltaTime: number) {
        
    }
}


