import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WeaponTest')
export class WeaponTest extends Component {
    start() {
        console.log(77777)
    }

    public intoAtkFrame() {
        console.log('进入攻击判定帧111')
        // this._colliderNode.active = true;
    }
    public endAtkFrame() {
        console.log('离开攻击判定帧111')
        // this._colliderNode.active = false;
    }

    update(deltaTime: number) {
        
    }
}


