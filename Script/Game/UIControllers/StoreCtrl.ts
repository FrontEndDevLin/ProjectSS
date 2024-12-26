import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('StoreCtrl')
export class StoreCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log('StoreCtrl loaded')

        console.log('商店交互逻辑在本类里实现')
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


