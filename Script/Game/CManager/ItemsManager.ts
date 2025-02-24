import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
import { TROPHY_TYPE } from './DropItemManager';
import { getRandomNumber } from '../Common';
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

    // TODO: 将所有道具放在json文件里
    public itemsMap: ItemsMap = {};

    public itemsList: { key: string, cnt: number }[] = [];
    
    protected onLoad(): void {
        if (!ItemsManager.instance) {
            ItemsManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this._loadItemsMap();
    }

    start() {

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
