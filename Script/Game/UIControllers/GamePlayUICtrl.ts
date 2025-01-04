import { _decorator, Component, find, Label, Node, Widget } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUICtrl')
export class GamePlayUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this.views["HPUI"].getComponent(Widget).target = find("Canvas");
        this.views["WaveUI"].getComponent(Widget).target = find("Canvas");

        let wave = ChapterManager.instance.getCurrentChapter();
        this.views["WaveUI"].getChildByName("Wave").getComponent(Label).string = `${wave}`;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


