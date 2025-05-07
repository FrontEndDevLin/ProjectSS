import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { StoreManager } from '../../CManager/StoreManager';
const { ccclass, property } = _decorator;

@ccclass('ProductWpItemCtrl')
export class ProductWpItemCtrl extends OO_Component {
    private _storeItem: any = null;
    private _storeIdx: number = 0;

    protected onLoad(): void {
        super.onLoad();
    }

    private _buyItem() {
        StoreManager.instance.buyItem(this._storeIdx);
    }

    start() {
        // TODO: 区分weapon和item

        const storeItem = this.node.OO_param1;
        const storeIdx = this.node.OO_param2;
        this._storeIdx = storeIdx;
        this.views["Card/ProductOprBar/Assets"].on(Node.EventType.TOUCH_END, this._buyItem, this);

        let itemType: string = storeItem.item_type;
        if (itemType === 'weapon') {
            this.views["Card/ImgTxt/WName/Name"].getComponent(Label).string = storeItem.name;
            let wpPanelNode: Node = WeaponManager.instance.getWeaponPanelNode(storeItem.key);
            this.views["Card"].addChild(wpPanelNode);
        } else if (itemType === 'item') {
            this.views["Card/ImgTxt/WName/Name"].getComponent(Label).string = storeItem.label;
            // TODO: 商店 道具类面板界面还没做，这一块和武器的面板界面实现不统一，需要重新评估
        }
    }

    protected onDestroy(): void {
        // 
    }

    update(deltaTime: number) {
        
    }
}


