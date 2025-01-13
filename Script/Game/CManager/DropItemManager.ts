import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { EnemyManager } from './EnemyManager';
import { ChapterManager } from './ChapterManager';
const { ccclass, property } = _decorator;

/**
 * 物品掉落管理
 *  经验掉落
 *  战利品掉落/战利品有几率变成宝箱
 *  物品掉落概率 = 该敌人自身掉宝率 * 全局掉宝率修正
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

        this._dropExp("EMY001");
    }

    /**
     * 敌人死亡后，调用该接口，由该接口决定掉落物品
     */
    public dropItem(emyId: string, position) {
        let isDropExp = this._dropExp(emyId);
        if (isDropExp) {
            // TODO: 生成经验值预制体，在position周围掉落(掉落滑动动画)
        }
    }

    // 是否掉落经验 判断当前关卡的全局掉落修正
    private _dropExp(emyId: string): boolean {
        let expDropRate: number = this._emyRateMap[emyId].exp_drop_rate;
        // TODO: chapterData在每一波刚开始时刷新即可，目前性能较差
        let chapterData: any = ChapterManager.instance.getChapterData();
        // 经验爆率修正
        let expDropAmend: number = chapterData.exp_drop_amend;

        let rate: number = expDropRate * expDropAmend;
        if (rate >= 1) {
            return true;
        } else {
            return Math.random() <= rate;
        }
    }
    // 是否掉落战利品
    private _dropTrophy(emyId: string) {

    }

    update(deltaTime: number) {
        
    }
}


