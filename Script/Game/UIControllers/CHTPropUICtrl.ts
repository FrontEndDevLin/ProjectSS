import { _decorator, Component, Label, Node, UITransform } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.page 当前界面位置(store->商店，afterWave->收获流程界面)
 */
@ccclass('CHTPropUICtrl')
export class CHTPropUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        let CHTPropCardNode: Node = OO_UIManager.instance.loadUINode("chtProp/CHTPropCard", "CHTPropCardCtrl");
        this.views["Page/PropWrap"].addChild(CHTPropCardNode);
        let ItemsWrapCardNode: Node = OO_UIManager.instance.loadUINode("chtProp/ItemsWrapCard", "NONE");
        this.views["Page/ItemsWrap"].addChild(ItemsWrapCardNode);

        let page: string = this.node.OO_param1.page;
        let backBtnTxt = "";
        if (page === "store") {
            backBtnTxt = "返回商店";
        } else if (page === "afterWave") {
            backBtnTxt = "返回";
        }
        if (backBtnTxt) {
            this.views["Bottom/Back/Txt"].getComponent(Label).string = backBtnTxt;
        }

        this.views["Bottom/Back"].on(Node.EventType.TOUCH_END, () => {
            if (page === "store") {
                ChapterManager.instance.showPrepareUI();
                CharacterPropManager.instance.hideCHTPropUI();
            } else if (page === "afterWave") {
                ChapterManager.instance.showAfterWaveUI();
                CharacterPropManager.instance.hideCHTPropUI();
            }
        }, this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


