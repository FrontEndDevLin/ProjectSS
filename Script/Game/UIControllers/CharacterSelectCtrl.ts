import { _decorator, Component, Label, Node, RichText } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import CharacterManager from '../CManager/CharacterManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { Buff } from '../Interface';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterSelectCtrl')
export class CharacterSelectCtrl extends OO_Component {
    private _chtData: any;

    start() {
        let chtCardNode: Node = OO_UIManager.instance.loadUINode("common/CHTCard", "NONE");
        let panelWrapNode: Node = OO_UIManager.instance.loadUINode("common/PanelWrap", "NONE");

        let chtSmpList: any[] = CharacterManager.instance.getSimpleList();
        chtSmpList.forEach((item: any, i) => {
            let cardNode: Node = OO_UIManager.instance.loadUINode("common/CHTMinCard", "NONE");
            cardNode.OO_param1 = item;
            this.views["CHTList/CHTListWrap"].addChild(cardNode);

            cardNode.on(Node.EventType.TOUCH_END, () => {
                this._touchCHTMinCard(cardNode)
            }, this);
        });

        // TODO: 加工panelWrapNode
        chtCardNode.addChild(panelWrapNode);
        this.views["CHTWrap"].addChild(chtCardNode);

        this.updateView();

        this.views["BottomBar/GO"].on(Node.EventType.TOUCH_END, () => {
            if (!this._chtData) {
                return console.log("角色未选择");
            } else {
                ChapterManager.instance.chtSelectComplete(this._chtData.key);
            }
        }, this);
    }

    // 点击角色头像触发
    private _touchCHTMinCard(cardNode: Node) {
        this._chtData = cardNode.OO_param1;
        this._updateCHTCard();
    }
    private _updateCHTCard() {
        if (this._chtData) {
            this.views["CHTWrap/CHTCard/Card/ImgTxt/WName/Name"].getComponent(Label).string = this._chtData.label;
            this.views["CHTWrap/CHTCard/Card/ImgTxt/WName/Types"].getComponent(Label).string = "角色";

            let buffList: Buff[] = this._chtData.buff;
            let buffTxt: string = "";
            buffList.forEach((buff, i) => {
                buffTxt += CharacterPropManager.instance.getBuffTxt(buff);
                if (i !== buffList.length - 1) {
                    buffTxt += "<br/>";
                }
            });
            this.views["CHTWrap/CHTCard/Card/Content"].getComponent(RichText).string = buffTxt;
        }
    }

    update(deltaTime: number) {
        
    }
}


