import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { CEVENT_CURRENCY } from '../CEvent';
const { ccclass, property } = _decorator;

/**
 * 金币管理
 */

@ccclass('CurrencyManager')
export class CurrencyManager extends OO_UIManager {
    static instance: CurrencyManager = null;

    // 金币量
    private _currency: number = 10;
    // 库存量
    private _storage: number = 5;

    protected onLoad(): void {
        if (!CurrencyManager.instance) {
            CurrencyManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    public getCurrency() {
        return this._currency;
    }
    public getStorage() {
        return this._storage;
    }

    public addCurrency(n: number) {
        if (n < 0) {
            return;
        }
        n = Math.floor(n);
        this._currency += n;

        this.runEventFn(CEVENT_CURRENCY.CRY_CHANGE);
    }
    public addStorage(n: number) {
        n = Math.floor(n);
        if (this._storage + n < 0) {
            return false;
        }
        this._storage += n;
        this.runEventFn(CEVENT_CURRENCY.STO_CHANGE);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


