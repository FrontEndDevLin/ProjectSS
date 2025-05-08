import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { StoreManager } from '../../CManager/StoreManager';
import OO_ResourceManager from '../../../OO/Manager/OO_ResourceManager';
import { EventBus } from '../../../OO/Manager/OO_MsgManager';
import { CEVENT_PREPARE } from '../../CEvent';
import { ChapterManager } from '../../CManager/ChapterManager';
const { ccclass, property } = _decorator;

@ccclass('StoreCtrl')
export class StoreCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        StoreManager.instance.initStore();
        console.log('StoreCtrl loaded')

        this._updateView();

        this.views["StoreInfo/RefBtn"].on(Node.EventType.TOUCH_END, this._refStore);
    }

    private _updateView() {
        // console.log(StoreManager.instance.currentStore)
        this.views["ItemList"].children.forEach((slotNode: Node, i) => {
            slotNode.removeAllChildren();
            const item = StoreManager.instance.currentStore[i];
            if (item) {
                const uiNode: Node = this.loadUINode("ProductWpItem", "ProductWpItemCtrl");
                uiNode.OO_param1 = item;
                uiNode.OO_param2 = i;
                slotNode.addChild(uiNode);
            }
        });
        // console.log(this.views["ItemList"])
    }

    start() {
        EventBus.on(CEVENT_PREPARE.UPDATE_STORE, () => {
            this._updateView();
        });
    }

    // 点击刷新调用
    private _refStore() {
        // TODO: 需要检查是否够刷新，结合商店刷新次数
        StoreManager.instance.refreshStore();
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        this.views["StoreInfo/RefBtn"].off(Node.EventType.TOUCH_END, this._refStore);
    }
}


