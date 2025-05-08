import { _decorator, Component, find, Node, Prefab, Widget } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
import { TROPHY_TYPE } from './DropItemManager';
import { getRandomNumber } from '../Common';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { BItem, Buff, ItemsMap } from '../Interface';
import { CharacterPropManager } from './CharacterPropManager';
import { CEVENT_CHARACTER } from '../CEvent';
import { getScriptTypeItems } from '../ScriptTypeItems';
const { ccclass, property } = _decorator;

export interface SimpleItem {
    key: string,
    cnt: number
}
export interface DetailItem extends SimpleItem {
    icon?: any,
    level: number
}
/**
 * 道具管理类，管理所有道具
 */
@ccclass('ItemsManager')
export class ItemsManager extends OO_UIManager {
    static instance: ItemsManager;

    // 所有道具放在json文件里
    public itemsMap: ItemsMap = {};

    public itemsList: SimpleItem[] = [];
    public itemsListIdx: { [key: string]: number } = {};

    // 当前波次拿取的宝箱 [品质1, 品质2]
    private _chestList: number[] = [];

    private _chestIconUINode: Node = null;

    // 当前宝箱开出的道具
    private _chestItem: BItem = null;
    
    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this._loadItemsMap();

        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/chtProp/PreviewItems",
            "Prefabs/chtProp/ItemsWrapCard",
            "Prefabs/common/ChestIconWrap",
            "Prefabs/common/ChestIcon",
            "Prefabs/chtProp/ItemsIcon"
        ] }], (total, current) => {
        }, (err, data: any) => {
        });
    }

    start() {

    }

    private _loadItemsMap() {
        let itemsDbData: ItemsMap = DBManager.instance.getDbData("Items");
        let characterDbData: ItemsMap = DBManager.instance.getDbData("Character");
        for (let key in itemsDbData) {
            if (key.includes("desc")) {
                continue;
            }
            let bItem: BItem = itemsDbData[key];
            this.itemsMap[bItem.key] = bItem;
        }
        for (let key in characterDbData) {
            if (!key.includes("CR")) {
                continue;
            }
            let bItem: BItem = characterDbData[key];
            bItem.level = 1;
            this.itemsMap[bItem.key] = bItem;
        }
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
    // 捡起宝箱
    public pickChest(n: number) {
        if (n === TROPHY_TYPE.CHEST || n === TROPHY_TYPE.GREAT_CHEST) {
            this._chestList.push(n);
            this._loadChestIcon();
        }
    }
    public hasChest(): boolean {
        return this._chestList.length > 0;
    }
    private _popChestList() {
        this._chestList.pop();
        this._loadChestIcon();
    }
    // 开箱接口
    public openChest(): BItem {
        let chestQuality: number = this._chestList[this._chestList.length - 1];
        let item: BItem = null;
        switch (chestQuality) {
            case TROPHY_TYPE.CHEST: {
                item = this._getRandomItem(chestQuality);
                this._chestItem = item;
            } break;
            case TROPHY_TYPE.GREAT_CHEST: {

            } break;
        }
        return item;
    }
    // 拿取宝箱内道具
    public getChestItem() {
        if (!this._chestItem) {
            return;
        }
        let key: string = this._chestItem.key;
        this.addItem(key);
        this._chestItem = null;
        this._popChestList();
    }

    // 获取多个随机道具时用到，用于防止重复
    // 注意当道具数量不够时会有死循环风险
    private _randomItemKeys: string[] = [];
    // 随机获取指定数量的道具，不可重复
    public getRandomItems(n?: number): BItem[] {
        this._randomItemKeys = [];
        let items: BItem[] = []
        if (n === 0) {
            return items;
        }
        n = n || 4;
        for (let i = 0; i < n; i++) {
            let item: BItem = this._getRandomItem();
            if (item) {
                this._randomItemKeys.push(item.key);
                items.push(item);
            }
        }
        this._randomItemKeys = [];
        return items;
    }
    private _getRandomItem(quality: number = TROPHY_TYPE.CHEST): BItem {
        let item: BItem = null;
        switch (quality) {
            // TODO: 普通宝箱，大概率获得白色、蓝色道具；小概率获得紫色道具；极小概率获得红色道具(概率也要随着关卡变动)
            case TROPHY_TYPE.CHEST: {
                let itemKeysPool: string[] = this._getItemsPool();
                if (itemKeysPool.length) {
                    let idx: number = getRandomNumber(0, itemKeysPool.length - 1);
                    let key: string = itemKeysPool[idx];
                    item = this.itemsMap[key];
                }
            } break;
            // 极品宝箱，百分百获得红色道具
            case TROPHY_TYPE.GREAT_CHEST: {

            } break;
        }
        return item;
    }
    // 回收宝箱内道具
    public recycleChestItem() {
        if (!this._chestItem) {
            return;
        }
        // TODO: 需要算钱
        this._chestItem = null;
        this._popChestList();
    }

    // 增加道具
    public addItem(key: string) {
        // 如果是角色
        let item: BItem = this.itemsMap[key];
        console.log(key)
        console.log(item)
        if (!item) {
            return;
        }
        let idx: number = this.itemsListIdx[key];
        if (typeof idx === "number") {
            this.itemsList[idx].cnt++;
        } else {
            idx = this.itemsList.push({ key: item.key, cnt: 1 }) - 1;
            this.itemsListIdx[key] = idx;
        }

        this.runEventFn(CEVENT_CHARACTER.ITEMS_CHANGE);

        console.log(item)

        let buffList: Buff[] = item.buff;

        for (let buff of buffList) {
            if (buff.type === "event") {
                let itemName: string = buff.script;
                getScriptTypeItems(itemName).addListener();
            }
        }

        CharacterPropManager.instance.updateProp(buffList);
    }

    // 获取指定道具的数量
    public getItemsCnt(key: string): number {
        let itemsIdx: any = this.itemsListIdx[key];
        if (typeof itemsIdx !== "number") {
            return 0;
        }
        return this.itemsList[itemsIdx].cnt;
    }
    
    private _getItemsPool(): string[] {
        // TODO: 从itemsMap中获取道具池给用户选择，需要先排除掉角色已拥有的独特道具，和已达到限制的道具
        let pool: string[] = [];
        for (let key in this.itemsMap) {
            if (key.includes("CR")) {
                continue;
            }
            // 排除已进入当前商店列表的项目
            if (this._randomItemKeys.indexOf(key) !== -1) {
                continue;
            }
            pool.push(key)
        }
        return pool;
    }

    // 属性界面获取道具列表
    public getChtItemsList(): DetailItem[] {
        let list: DetailItem[] = [];
        this.itemsList.forEach((sItem: SimpleItem, i) => {
            let { key, cnt } = sItem;
            let item: BItem = this.itemsMap[key];
            list.push({
                key,
                cnt,
                icon: "",
                level: item.level
            })
        });
        return list;
    }

    // 获取指定道具的富文本属性标签词条
    public getItemsPanelRichTxt(key: string): string {
        if (!key) {
            return "";
        }
        let item: BItem = this.itemsMap[key];
        if (!item) {
            return "";
        }
        let buffList: Buff[] = item.buff;
        let buffTxt = "";
        buffList.forEach((buff, i) => {
            buffTxt += CharacterPropManager.instance.getBuffTxt(buff);
            if (i !== buffList.length - 1) {
                buffTxt += "<br/>";
            }
        });
        return buffTxt;
    }

    update(deltaTime: number) {
        
    }
}
