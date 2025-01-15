import { _decorator, Component, Node, Prefab, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { EnemyManager } from './EnemyManager';
import { ChapterManager } from './ChapterManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

/**
 * 物品掉落管理
 *  经验掉落
 *  战利品掉落/战利品有几率变成宝箱
 *  物品掉落概率 = 该敌人自身掉宝率 * 全局掉宝率修正
 */

@ccclass('DropItemManager')
export class DropItemManager extends OO_UIManager {
    public abName: string = "GP";

    static instance: DropItemManager = null;

    public rootNode: Node = null;

    private _emyRateMap: any = {};

    // 关卡爆率修正数据
    private _chapterData: any = {};

    protected onLoad(): void {
        if (!DropItemManager.instance) {
            DropItemManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/dropItem/Exp`] }], () => {}, err => {
            console.log('经验块预设体加载')
        });

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

    // 更新全局爆率修正概率
    public updateChapterRateData() {
        this._chapterData = ChapterManager.instance.getChapterData();
    }

    /**
     * 敌人死亡后，调用该接口，由该接口决定掉落物品
     */
    public dropItem(emyId: string, position: Vec3) {
        let isDropExp = this._isDropExp(emyId);
        if (isDropExp) {
            // TODO: 生成经验值预制体，在position周围掉落(掉落滑动动画)
        }
    }

    // 是否掉落经验 判断当前关卡的全局掉落修正
    private _isDropExp(emyId: string): boolean {
        let expDropRate: number = this._emyRateMap[emyId].exp_drop_rate;
        // 经验爆率修正
        let expDropAmend: number = this._chapterData.exp_drop_amend;

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


