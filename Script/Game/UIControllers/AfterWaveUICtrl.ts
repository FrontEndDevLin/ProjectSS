import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

@ccclass('AfterWaveUICtrl')
export class AfterWaveUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
        
        let chestCheckoutUINode: Node = this.loadUINode("afterWave/ChestCheckoutUI", "ChestCheckoutUICtrl");
        let levelUpUINode: Node = this.loadUINode("afterWave/ChestCheckoutUI", "LevelUpCtrl");
        // 使用Manager来控制？
        this.node.insertChild(chestCheckoutUINode, 0);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


