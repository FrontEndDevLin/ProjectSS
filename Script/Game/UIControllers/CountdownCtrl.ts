import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { COUNTDOWN_EVENT, CountdownManager } from '../CManager/CountdownManager';
const { ccclass, property } = _decorator;

/**
 * 控制游戏倒计时的显示
 */
@ccclass('CountdownCtrl')
export class CountdownCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_INIT, this._updateView, this);
        CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_REDUCE, this._updateView, this);
        // CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_OVER, this._endChapter, this);
    }

    private _updateView(err, seconds) {
        this.node.getComponent(Label).string = seconds;
    }

    start() {

    }

    protected onDestroy(): void {
        CountdownManager.instance.off(COUNTDOWN_EVENT.TIME_INIT, this._updateView, this);
        CountdownManager.instance.off(COUNTDOWN_EVENT.TIME_REDUCE, this._updateView, this);
    }

    update(dt: number) {
        
    }
}

