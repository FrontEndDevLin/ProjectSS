import { _decorator, Component, find, Node, Prefab, Widget } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
import { TROPHY_TYPE } from './DropItemManager';
import { getRandomNumber } from '../Common';
import { CEVENT_CHEST } from '../CEvent';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

interface Buff {
    // 类型为prop时，使用prop和value
    type: string,
    prop: string,
    value: number
    // 类型为script时，单独处理
}
interface BItem {
    key: string,
    // 道具等级 (白-蓝-紫-红)
    level: number,
    // 道具名
    label: string,
    // 道具分组名
    groupLabel: string,
    // 价格(基础价格，需要跟随关卡浮动)
    price: number,
    // 道具分组key
    groupKey: string,
    buff: Buff[]
}
interface ItemsMap {
    [key: string]: BItem
}

/**
 * 道具管理类，管理所有道具
 */
@ccclass('ItemsManager')
export class ItemsManager extends OO_UIManager {
    static instance: ItemsManager;

    // 所有道具放在json文件里
    public itemsMap: ItemsMap = {};

    public itemsList: { key: string, cnt: number }[] = [];
    public itemsListIdx: any = {};

    // 当前波次拿取的宝箱 [品质1, 品质2]
    private _chestList: number[] = [];

    private _chestIconUINode: Node = null;
    
    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this._loadItemsMap();

        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/common/ChestIconWrap",
            "Prefabs/common/ChestIcon"
        ] }], (total, current) => {
        }, (err, data: any) => {
        });
    }

    start() {

    }

    // 右上角宝箱列表
    public showChestIconUI() {
        this._chestIconUINode = this.showUI("common/ChestIconWrap", this.rootNode, "NONE");
        this._chestIconUINode.getComponent(Widget).target = find("Canvas");
        this._loadChestIcon();
    }
    public removeChestIconUI() {
        this.removeUI("ChestIconWrap");
        this._chestIconUINode = null;
    }
    private _loadChestIcon() {
        this._chestIconUINode.removeAllChildren();
        for (let quality of this._chestList) {
            let uiName = "";
            switch (quality) {
                case TROPHY_TYPE.CHEST: {
                    uiName = "common/ChestIcon";
                } break;
            }
            this.showUI(uiName, this._chestIconUINode, "NONE");
        }
    }

    public pickChest(n: number) {
        if (n === TROPHY_TYPE.CHEST || n === TROPHY_TYPE.GREAT_CHEST) {
            this._chestList.push(n);
            this._loadChestIcon();
        }
    }

    // 增加道具
    public addItem(key: string) {
        // 如果是角色
        if (key.includes("CR")) {

        }
        let item: BItem = this.itemsMap[key];
        if (!item) {
            return;
        }
        let idx: number = this.itemsListIdx[key];
        if (idx && typeof idx === "number") {
            this.itemsList[idx].cnt++;
        } else {
            idx = this.itemsList.push({ key: item.key, cnt: 1 }) - 1;
            this.itemsListIdx[key] = idx;
        }
        // TODO: 增加完道具后，需要更新角色属性
    }

    public hasChest(): boolean {
        return this._chestList.length > 0;
    }

    private _loadItemsMap() {
        let dbData: ItemsMap = DBManager.instance.getDbData("Items");
        for (let key in dbData) {
            if (key.includes("desc")) {
                continue;
            }
            let bItem: BItem = dbData[key];
            this.itemsMap[bItem.key] = bItem;
        }
    }

    public getRandomItem(quality: number = TROPHY_TYPE.CHEST): BItem {
        let item: BItem = null;
        switch (quality) {
            // TODO: 普通宝箱，大概率获得白色、蓝色道具；小概率获得紫色道具；极小概率获得红色道具(概率也要随着关卡变动)
            case TROPHY_TYPE.CHEST: {
                let itemKeysPool: string[] = this._getItemsPool();
                let idx: number = getRandomNumber(0, itemKeysPool.length - 1);
                let key: string = itemKeysPool[idx];
                item = this.itemsMap[key];
            } break;
            // 极品宝箱，百分百获得红色道具
            case TROPHY_TYPE.GREAT_CHEST: {

            } break;
        }
        return item;
    }
    private _getItemsPool(): string[] {
        // TODO: 从itemsMap中获取道具池给用户选择，需要先排除掉角色已拥有的独特道具，和已达到限制的道具
        let pool: string[] = [];
        for (let key in this.itemsMap) {
            pool.push(key)
        }
        return pool;
    }

    update(deltaTime: number) {
        
    }
}
