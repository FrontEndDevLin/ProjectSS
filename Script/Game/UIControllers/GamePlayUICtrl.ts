import { _decorator, Component, find, Node, Widget } from 'cc';
import { OO_Component } from '../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUICtrl')
export class GamePlayUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this.views["HPUI"].getComponent(Widget).target = find("Canvas")
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


