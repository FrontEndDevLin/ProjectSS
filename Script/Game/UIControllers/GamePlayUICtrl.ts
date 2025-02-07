import { _decorator, Component, find, Label, Node, UITransform, Widget } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_CHARACTER, CEVENT_GAME } from '../CEvent';
import { LevelManager } from '../CManager/LevelManager';
const { ccclass, property } = _decorator;

@ccclass('GamePlayUICtrl')
export class GamePlayUICtrl extends OO_Component {
    private _HPWidth: number = 0;

    protected onLoad(): void {
        super.onLoad();

        this.views["HPUI"].getComponent(Widget).target = find("Canvas");
        this.views["WaveUI"].getComponent(Widget).target = find("Canvas");

        this._initHPUIWidth();

        this._updateLevel();
        LevelManager.instance.on(CEVENT_CHARACTER.EXP_CHANGE, this._updateExpBar, this);
        LevelManager.instance.on(CEVENT_CHARACTER.LEVEL_UP, this._updateLevel, this);
    }

    start() {
        EventBus.on(CEVENT_GAME.START, this._updateWave, this);
    }

    private _updateWave() {
        let wave = ChapterManager.instance.getCurrentChapter();
        this.views["WaveUI"].getChildByName("Wave").getComponent(Label).string = `${wave}`;
    }

    private _initHPUIWidth() {
        this._HPWidth = this.views["HPUI/HPWrap"].getComponent(UITransform).width;
    }

    private _updateExpBar(err, data: any) {
        let expCurrent: number = Math.floor(data.expCurrent);
        let expTotal: number = data.expTotal;
        
        let expBarWidth: number = Math.floor(this._HPWidth * expCurrent / expTotal);

        this.views["HPUI/EXPWrap/EXPProg"].getComponent(UITransform).width = expBarWidth;
    }
    private _updateLevel() {
        this.views["HPUI/Lv/Val"].getComponent(Label).string = `${LevelManager.instance.level}`;
    }

    protected onDestroy(): void {
        LevelManager.instance.off(CEVENT_CHARACTER.EXP_CHANGE, this._updateExpBar, this);
        LevelManager.instance.off(CEVENT_CHARACTER.LEVEL_UP, this._updateLevel, this);
    }

    update(deltaTime: number) {
        
    }
}


