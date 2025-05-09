import { _decorator, Component, Label, Node, RichText } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { ItemsManager } from '../../CManager/ItemsManager';
import { TROPHY_TYPE } from '../../CManager/DropItemManager';
import { BItem, Buff } from '../../Interface';
import { CharacterPropManager } from '../../CManager/CharacterPropManager';
import { ChapterManager } from '../../CManager/ChapterManager';
import { AfterWaveUICtrl } from '../AfterWaveUICtrl';
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
            this.views["Wrap/ItemsCard/Card/ImgTxt/WName/Name"].getComponent(Label).string = item.label;
            this.views["Wrap/ItemsCard/Card/ImgTxt/WName/Types"].getComponent(Label).string = item.groupLabel;
            let buffTxt: string = ItemsManager.instance.getItemsPanelRichTxt(item.key);
            this.views["Wrap/ItemsCard/Card/Content"].getComponent(RichText).string = buffTxt;
        } else {
            let afterWaveUICtrl: AfterWaveUICtrl = this.node.parent.getComponent("AfterWaveUICtrl") as AfterWaveUICtrl;
            afterWaveUICtrl.closeChestCheckoutUI();
        }
    }

    update(deltaTime: number) {
        
    }
}


