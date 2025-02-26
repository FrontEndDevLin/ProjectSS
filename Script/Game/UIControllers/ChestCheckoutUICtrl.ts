import { _decorator, Component, Label, Node, RichText } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ItemsManager } from '../CManager/ItemsManager';
import { TROPHY_TYPE } from '../CManager/DropItemManager';
import { BItem, Buff } from '../Interface';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
import { ChapterManager } from '../CManager/ChapterManager';
const { ccclass, property } = _decorator;

@ccclass('ChestCheckoutUICtrl')
export class ChestCheckoutUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this._loadChest();

        this.views["Wrap/OperBar/GetBtn"].on(Node.EventType.TOUCH_END, this._getChest, this);
        this.views["Wrap/OperBar/RecBtn"].on(Node.EventType.TOUCH_END, this._recChest, this);
    }
    
    start() {

    }

    private _getChest() {
        ItemsManager.instance.getChestItem();
        this._loadChest();
    }
    private _recChest() {
        ItemsManager.instance.recycleChestItem();
        this._loadChest();
    }

    private _loadChest() {
        if (ItemsManager.instance.hasChest()) {
            let item: BItem = ItemsManager.instance.openChest();
            this.views["Wrap/ChestCard/Card/ImgTxt/WName/Name"].getComponent(Label).string = item.label;
            this.views["Wrap/ChestCard/Card/ImgTxt/WName/Types"].getComponent(Label).string = item.groupLabel;
            let buffList: Buff[] = item.buff;
            let buffTxt: string = "";
            buffList.forEach((buff, i) => {
                buffTxt += CharacterPropManager.instance.getBuffTxt(buff);
                if (i !== buffList.length - 1) {
                    buffTxt += "<br/>";
                }
            });
            this.views["Wrap/ChestCard/Card/Content"].getComponent(RichText).string = buffTxt;
        } else {
            ChapterManager.instance.closeChestCheckoutUI();
        }
    }

    update(deltaTime: number) {
        
    }
}


