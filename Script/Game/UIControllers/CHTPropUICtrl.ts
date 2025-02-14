import { _decorator, Component, Node, UITransform } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

@ccclass('CHTPropUICtrl')
export class CHTPropUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        let CHTPropCardNode: Node = OO_UIManager.instance.loadUINode("prepare/CHTPropCard", "CHTPropCardCtrl");
        this.node.addChild(CHTPropCardNode);

        this.views["Bottom/Back"].on(Node.EventType.TOUCH_END, () => {
            ChapterManager.instance.showPrepareUI();
            CharacterPropManager.instance.hideCHTPropUI();
        }, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


