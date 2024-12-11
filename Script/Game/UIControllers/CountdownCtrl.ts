import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_COUNTDOWN, CEVENT_GAME, CEVENT_PREPLAY } from '../CEvent';
const { ccclass, property } = _decorator;

/**
 * 控制游戏倒计时和结束
 */
@ccclass('CountdownCtrl')
export class CountdownCtrl extends OO_Component {
    private _cd: number = 0;
    private _seconds: number = 0;
    private _playing: boolean = false;

    protected onLoad(): void {
        super.onLoad();

        EventBus.on(CEVENT_PREPLAY.COUNTDOWN, this._preplay, this);
        EventBus.on(CEVENT_GAME.START, this._startCountdown, this);
    }

    private _preplay(seconds) {
        this._seconds = seconds;
        this._updateView();
    }
    private _startCountdown() {
        this._playing = true;
        this._updateView();
    }
    private _onCountdownOver() {
        this._playing = false;
        EventBus.emit(CEVENT_COUNTDOWN.OVER);
    }

    private _updateView() {
        this.node.getComponent(Label).string = this._seconds.toString();
    }
    
    start() {

    }

    protected onDestroy(): void {
        EventBus.off(CEVENT_PREPLAY.COUNTDOWN, this._preplay, this);
        EventBus.off(CEVENT_GAME.START, this._startCountdown, this);
    }

    update(dt: number) {
        if (!this._playing) {
            return;
        }
        this._cd += dt;
        if (this._cd >= 1) {
            this._cd -= 1;
            this._seconds -= 1;
            this._updateView();
            if (this._seconds <= 0) {
                this._onCountdownOver();
            }
        }
    }
}


