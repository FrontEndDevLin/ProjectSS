import { _decorator, Component, instantiate, Label, Node, Prefab } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { StoreManager } from '../../CManager/StoreManager';
import OO_ResourceManager from '../../../OO/Manager/OO_ResourceManager';
import { StoreItemCtrl } from './StoreItemCtrl';
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
    }

    private _updateView() {
        // console.log(StoreManager.instance.currentStore)
        this.views["ItemList"].children.forEach((slotNode: Node, i) => {
            slotNode.removeAllChildren();
            const item = StoreManager.instance.currentStore[i];
            if (item) {
                const uiNode: Node = this.loadUINode("prepare/StoreItem", "StoreItemCtrl");
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
        })
    }

    update(deltaTime: number) {
        
    }
}


