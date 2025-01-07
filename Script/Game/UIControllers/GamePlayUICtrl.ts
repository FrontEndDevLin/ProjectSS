import { _decorator, Component, find, Label, Node, Widget } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_GAME } from '../CEvent';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUICtrl')
export class GamePlayUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this.views["HPUI"].getComponent(Widget).target = find("Canvas");
        this.views["WaveUI"].getComponent(Widget).target = find("Canvas");
    }

    start() {
        EventBus.on(CEVENT_GAME.START, this._updateWave, this);
    }

    private _updateWave() {
        let wave = ChapterManager.instance.getCurrentChapter();
        this.views["WaveUI"].getChildByName("Wave").getComponent(Label).string = `${wave}`;
    }

    update(deltaTime: number) {
        
    }
}


