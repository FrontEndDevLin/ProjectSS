import { _decorator, Component, EventTouch, Label, Node, RichText, v3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { DetailItem, ItemsManager } from '../../CManager/ItemsManager';
import { BItem, Buff } from '../../Interface';
import { CharacterPropManager } from '../../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

@ccclass('PreviewItemsCtrl')
export class PreviewItemsCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this.views["Mask"].on(Node.EventType.TOUCH_END, () => {
            this._hide();
        });

        this.views["ItemsCard/Card"].on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            e.propagationStopped = true;
        });
    }

    public loadView(dItem: DetailItem) {
        let bItem: BItem = ItemsManager.instance.itemsMap[dItem.key];
        this.views["ItemsCard/Card/ImgTxt/WName/Name"].getComponent(Label).string = bItem.label;
        this.views["ItemsCard/Card/ImgTxt/WName/Types"].getComponent(Label).string = bItem.groupLabel;
        let buffList: Buff[] = bItem.buff;
        let buffTxt: string = "";
        buffList.forEach((buff, i) => {
            buffTxt += CharacterPropManager.instance.getBuffTxt(buff);
            if (i !== buffList.length - 1) {
                buffTxt += "<br/>";
            }
        });
        this.views["ItemsCard/Card/Content"].getComponent(RichText).string = buffTxt;
        this._show();
    }

    private _show() {
        this.node.setPosition(v3(0, 0));
    }
    private _hide() {
        this.node.setPosition(v3(2000, 0));
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


