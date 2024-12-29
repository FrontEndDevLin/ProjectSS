import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { StoreManager } from '../CManager/StoreManager';
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
        console.log(StoreManager.instance.currentStore)
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


