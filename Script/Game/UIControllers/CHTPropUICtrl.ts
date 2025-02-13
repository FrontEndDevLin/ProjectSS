import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

@ccclass('CHTPropUICtrl')
export class CHTPropUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        let CHTPropCardNode: Node = OO_UIManager.instance.loadUINode("prepare/CHTPropCard", "CHTPropCardCtrl");
        this.node.addChild(CHTPropCardNode);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


