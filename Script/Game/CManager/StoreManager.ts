import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import WeaponManager from './WeaponManager';
const { ccclass, property } = _decorator;

/**
 * 引入武器列表(从WeaponManager)，道具列表。（需要符合当前职业的道具）
 * 
 */
@ccclass('StoreManager')
export class StoreManager extends OO_UIManager {
    static instance: StoreManager = null;

    // 刷新次数
    private _refTime: number = 0;
    // 刷新价格
    public refCost: number = 0;
    public currentStore: any[] = [];

    protected onLoad(): void {
        if (!StoreManager.instance) {
            StoreManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    start() {

    }

    private _refreshStore() {
        let randomWeapons: any[] = WeaponManager.instance.getRandomWeapons();
        // TODO: 还需要获取随机道具
        this.currentStore = randomWeapons;
    }

    // 在每回合初次进入商店时调用
    public initStore() {
        this._refreshStore();
        this._refTime = 0;
        // TODO: 刷新价格根据当前关卡决定
        this.refCost = 0;
    }

    public refreshStore() {
        this._refreshStore();
        this._refTime++;
        // TODO: 刷新价格根据当前关卡决定
        this.refCost = this._refTime * 0;
    }

    update(deltaTime: number) {
        
    }
}


