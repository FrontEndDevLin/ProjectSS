import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('PrepareCtrl')
export class PrepareCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log('PrepareCtrl loaded')

        this.views["Store"].addComponent("StoreCtrl");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


