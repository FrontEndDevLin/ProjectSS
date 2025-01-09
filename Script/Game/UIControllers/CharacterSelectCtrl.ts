import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import CharacterManager from '../CManager/CharacterManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterSelectCtrl')
export class CharacterSelectCtrl extends OO_Component {
    start() {
        let chtCardNode: Node = OO_UIManager.instance.loadUINode("common/CHTCard", "NONE");
        let panelWrapNode: Node = OO_UIManager.instance.loadUINode("common/PanelWrap", "NONE");

        console.log(CharacterManager.instance.getSimpleList())

        // TODO: 加工panelWrapNode
        chtCardNode.addChild(panelWrapNode);
        this.views["CHTWrap"].addChild(chtCardNode);

        this.views["BottomBar/GO"].on(Node.EventType.TOUCH_END, () => {
            if (!CharacterManager.instance.characterId) {
                return console.log("角色未选择");
            }
        }, this);
    }



    update(deltaTime: number) {
        
    }
}


