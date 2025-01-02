import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('PrepareCtrl')
export class PrepareCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log('PrepareCtrl loaded')

        this.views["Store"].addComponent("StoreCtrl");
        this.views["Weapon"].addComponent("PrepareWeaponCtrl");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


