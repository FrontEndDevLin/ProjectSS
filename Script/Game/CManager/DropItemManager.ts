import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

/**
 * 物品掉落管理
 *  经验掉落
 *  战利品掉落/战利品有几率变成宝箱
 *  物品掉落概率 = 该敌人自身掉宝率 * 全局修正掉宝率
 */

@ccclass('DropItemManager')
export class DropItemManager extends OO_UIManager {
    public rootNode: Node = null;

    private _emyRateMap: any = {};

    protected onLoad(): void {
        super.onLoad();

        let rootNode: Node = new Node("DropItemBox");
        this.node.addChild(rootNode);
        this.rootNode = rootNode;

        console.log("DropItem Manager loaded");
        this._initRateMap();
    }

    start() {

    }

    private _initRateMap() {
        let emyList: any[] = EnemyManager.instance.getDBEnemyList(["id", "exp_drop_rate", "trophy_drop_rate"]);
        for (let emyItem of emyList) {
            this._emyRateMap[emyItem.id] = emyItem;
        }
    }

    /**
     * 敌人死亡后，调用该接口，由该接口决定掉落物品
     */
    public dropItem(emyId: string, position) {
        // 判断当前关卡的全局掉落修正
    }

    update(deltaTime: number) {
        
    }
}


