import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { StoreManager } from '../../CManager/StoreManager';
import OO_ResourceManager from '../../../OO/Manager/OO_ResourceManager';
import { StoreItemCtrl } from './StoreItemCtrl';
const { ccclass, property } = _decorator;

@ccclass('StoreCtrl')
export class StoreCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        StoreManager.instance.initStore();
        console.log('StoreCtrl loaded')

        console.log('商店交互逻辑在本类里实现')
        this._updateView();
    }

    private _updateView() {
        // console.log(StoreManager.instance.currentStore)
        for (let item of StoreManager.instance.currentStore) {
            const uiNode: Node = this.loadUINode("prepare/StoreItem", "StoreItemCtrl");
            this.views["ItemList"].addChild(uiNode);
            let storeItemCtx: StoreItemCtrl = uiNode.getComponent("StoreItemCtrl") as StoreItemCtrl;
            storeItemCtx.initPanelItem(item);
        }
        // console.log(this.views["ItemList"])
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


