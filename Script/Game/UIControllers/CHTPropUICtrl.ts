import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.page 当前界面位置(store->商店，levelUp->升级界面)
 */
@ccclass('CHTPropUICtrl')
export class CHTPropUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        let CHTPropCardNode: Node = OO_UIManager.instance.loadUINode("prepare/CHTPropCard", "CHTPropCardCtrl");
        this.node.addChild(CHTPropCardNode);

        let page: string = this.node.OO_param1.page;
        let backBtnTxt = "";
        if (page === "store") {
            backBtnTxt = "返回商店";
        } else if (page === "levelUp") {
            backBtnTxt = "返回升级";
        }
        if (backBtnTxt) {
            this.views["Bottom/Back/Txt"].getComponent(Label).string = backBtnTxt;
        }

        this.views["Bottom/Back"].on(Node.EventType.TOUCH_END, () => {
            if (page === "store") {
                ChapterManager.instance.showPrepareUI();
                CharacterPropManager.instance.hideCHTPropUI();
            } else if (page === "levelUp") {
                ChapterManager.instance.showLevelUpUI();
                CharacterPropManager.instance.hideCHTPropUI();
            }
        }, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


