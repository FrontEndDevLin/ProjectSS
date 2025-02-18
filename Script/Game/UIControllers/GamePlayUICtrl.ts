import { _decorator, Component, find, Label, Node, UITransform, Widget } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_CHARACTER, CEVENT_CURRENCY, CEVENT_GAME } from '../CEvent';
import { LevelManager } from '../CManager/LevelManager';
import { SCREEN_HEIGHT, SCREEN_WIDTH, transportWorldPosition } from '../Common';
import CharacterManager from '../CManager/CharacterManager';
import { DropItemManager } from '../CManager/DropItemManager';
import { CurrencyManager } from '../CManager/CurrencyManager';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
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

        CurrencyManager.instance.on(CEVENT_CURRENCY.CRY_CHANGE, this._updateCurrency, this);
        CurrencyManager.instance.on(CEVENT_CURRENCY.STO_CHANGE, this._updateStorage, this);

        // 初始化显示金币、库存量
        this._updateCurrency();
        this._updateStorage();
    }

    start() {
        EventBus.on(CEVENT_GAME.START, this._onGameStart, this);

        setTimeout(() => {
            // 将Exp图标坐标转化为世界坐标，存储在DropItemManager里
            DropItemManager.instance.expIconWorldPos = transportWorldPosition(this.views["HPUI/Collect/Storage/Ico"].worldPosition);
        })
    }

    private _onGameStart() {
        this._updateHP();
        this._updateWave();
    }

    private _updateWave() {
        let wave = ChapterManager.instance.getCurrentChapter();
        this.views["WaveUI"].getChildByName("Wave").getComponent(Label).string = `${wave}`;
    }
    private _updateHP() {
        let hp: number = CharacterPropManager.instance.hp.value;
        let hp_cur: number = CharacterPropManager.instance.hp_cur.value;
        let hpNumStr: string = `${hp_cur}/${hp}`;
        this.views["HPUI/HPWrap/HPNum"].getComponent(Label).string = hpNumStr;

        let hpBarWidth: number = Math.floor(this._HPWidth * hp_cur / hp);
        this.views["HPUI/HPWrap/HPProg"].getComponent(UITransform).width = hpBarWidth;
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

    // 更新金币
    private _updateCurrency() {
        this.views["HPUI/Collect/Currency/Val"].getComponent(Label).string = `${CurrencyManager.instance.getCurrency()}`;
    }
    // 更新库存
    private _updateStorage() {
        this.views["HPUI/Collect/Storage/Val"].getComponent(Label).string = `${CurrencyManager.instance.getStorage()}`;
    }

    protected onDestroy(): void {
        LevelManager.instance.off(CEVENT_CHARACTER.EXP_CHANGE, this._updateExpBar, this);
        LevelManager.instance.off(CEVENT_CHARACTER.LEVEL_UP, this._updateLevel, this);
    }

    update(deltaTime: number) {
        
    }
}


