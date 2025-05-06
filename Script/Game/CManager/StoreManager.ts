import { _decorator, Component, Node, Prefab } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import WeaponManager from './WeaponManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_PREPARE } from '../CEvent';
import { BProp, Buff } from '../Interface';
import { ChapterManager } from './ChapterManager';
import { getRandomNumber } from '../Common';
const { ccclass, property } = _decorator;

/**
 * 引入武器列表(从WeaponManager)，道具列表。（需要符合当前职业的道具）
 * 
 */
@ccclass('StoreManager')
export class StoreManager extends OO_UIManager {
    static instance: StoreManager = null;

    // 商店刷新次数
    private _storeRefTime: number = 0;
    // 商店刷新价格
    public storeRefCost: number = 0;
    public currentStore: any[] = [];

    // 升级属性刷新次数
    private _levUpdRefTime: number = 0;
    // 升级属性刷新价格
    public _levUpdRefCost: number = 0;
    public currentLevUpd: Buff[] = [];

    protected onLoad(): void {
        if (!StoreManager.instance) {
            StoreManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    start() {
        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/prepare/WpItem",
            "Prefabs/ProductWpItem"
        ] }], (total, current) => {
            // console.log(total, current)
        }, (err, data: any) => {
            if (err) {
                console.log(err);
                return;
            }
        })
    }

    // 随机刷出武器和道具，目前只刷武器
    private _refreshStore() {
        // 前3波时，固定刷出两把武器和两件道具
        // 之后每次普通刷新武器数量和道具数量随机，总和为4
        let weaponCount: number = 2;
        if (ChapterManager.instance.getCurrentChapter() > 2) {
            weaponCount = getRandomNumber(0, 4);
        }
        let itemCount: number = 4 - weaponCount;

        let randomWeapons: any[] = WeaponManager.instance.getRandomWeapons(weaponCount);
        // TODO: 还需要获取随机道具
        this.currentStore = randomWeapons;
    }

    // 在每回合初次进入商店时调用
    public initStore() {
        this._refreshStore();
        this._storeRefTime = 0;
        // TODO: 刷新价格根据当前关卡决定
        this.storeRefCost = 0;
    }

    public buyItem(idx) {
        // TODO: 确认是否能买武器
        const item = this.currentStore[idx];
        const itemId = item.id;

        if (!WeaponManager.instance.isCanByWeapon()) {
            console.log("槽位已满，无法购买武器");
            return;
        }

        WeaponManager.instance.addWeapon(itemId);
        this.currentStore[idx] = null;

        // 调用StoreCtrl的_updateView和PrepareWeaponCtrl.updateWeaponView
        EventBus.emit(CEVENT_PREPARE.UPDATE_STORE);
        EventBus.emit(CEVENT_PREPARE.UPDATE_WEAPON);
    }

    public refreshStore() {
        this._refreshStore();
        this._storeRefTime++;
        // TODO: 刷新价格根据当前关卡决定
        this.storeRefCost = this._storeRefTime * 0;
    }

    // 每回合初次进入升级界面时调用
    public initLevUpd() {
        this._refreshLevUpd();
        this._levUpdRefTime = 0;
        this._levUpdRefCost = 0;
    }
    // 刷新升级属性
    public refreshLevUpd(free?: boolean) {
        if (free) {
            this._refreshLevUpd();
        } else {
            this._levUpdRefTime++;
            this._levUpdRefCost = 0;
            this._refreshLevUpd();
        }
    }
    private _refreshLevUpd() {
        this.currentLevUpd = [
            { prop: "hp", value: 3 },
            { prop: "def", value: 1 },
            { prop: "range", value: 20 },
            { prop: "spd", value: 5 }
        ]
    }

    update(deltaTime: number) {
        
    }
}


