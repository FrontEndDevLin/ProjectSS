import { _decorator, Component, Node, Prefab } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

export enum COUNTDOWN_EVENT {
    TIME_INIT = 40,
    TIME_REDUCE, // 时间减少一秒
    TIME_REDUCE_TINY, // 时间减少一分秒 at 20 -> 19.9
    TIME_OVER
}

@ccclass('CountdownManager')
export class CountdownManager extends OO_UIManager {
    static instance: CountdownManager = null;

    private _tinyCd: number = 0;
    private _seconds: number = 0;
    private _playing: boolean = false;

    protected onLoad(): void {
        if (!CountdownManager.instance) {
            CountdownManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log('Countdown Manager loaded');

        let pLoadPrefabs: string[] = [
            "Prefabs/Countdown"
        ];
        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: pLoadPrefabs }], (total, current) => {
            // console.log(total, current)
        }, (err, data: any) => {
            if (err) {
                console.log(err);
                return;
            }
        })
    }

    showCountdown() {
        this.showUI("Countdown");
    }

    public preplay(seconds) {
        this._seconds = Math.floor(seconds);
        this.runEventFn(COUNTDOWN_EVENT.TIME_INIT, this._seconds);
    }
    public startCountdown() {
        this._playing = true;
        // this._updateView();
    }
    private _onCountdownOver() {
        this._playing = false;
        this.runEventFn(COUNTDOWN_EVENT.TIME_OVER);
    }

    start() {

    }

    update(dt: number) {
        if (!this._playing) {
            return;
        }
        this._tinyCd += dt;
        if (this._tinyCd >= 0.1) {
            this._tinyCd -= 0.1;
            this._seconds = Number((this._seconds - 0.1).toFixed(1));
            this.runEventFn(COUNTDOWN_EVENT.TIME_REDUCE_TINY, this._seconds);
            if (this._seconds % 1 === 0) {
                this.runEventFn(COUNTDOWN_EVENT.TIME_REDUCE, this._seconds);
                if (this._seconds <= 0) {
                    this._onCountdownOver();
                }
            }
        }
    }
}

