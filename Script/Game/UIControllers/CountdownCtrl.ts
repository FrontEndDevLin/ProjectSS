import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
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
    }

    public startCountdown(seconds: number) {
        if (seconds < 0) {
            return;
        }
        this._seconds = seconds;
        this._playing = true;
        this._updateView();
    }
    private _onCountdownOver() {
        this._playing = false;
        this.onCountdownOver();
    }
    // 外部维护该方法
    public onCountdownOver() {}

    private _updateView() {
        this.node.getComponent(Label).string = this._seconds.toString();
    }
    
    start() {

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


