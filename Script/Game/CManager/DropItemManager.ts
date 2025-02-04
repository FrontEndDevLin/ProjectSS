import { _decorator, Component, Node, Prefab, v3, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { EnemyManager } from './EnemyManager';
import { ChapterManager } from './ChapterManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { getFloatNumber, getRandomNumber, GP_UNIT } from '../Common';
const { ccclass, property } = _decorator;

/**
 * 物品掉落管理
 *  经验掉落
 *  战利品掉落/战利品有几率变成宝箱
 *  物品掉落概率 = 该敌人自身掉宝率 * 全局掉宝率修正
 */

export enum TROPHY_TYPE {
    NONE = 0,
    NORMAL = 1,
    CHESS,
    GREAT_CHESS
}

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

        OO_ResourceManager.instance.preloadResPkg([{
            abName: this.abName,
            assetType: Prefab,
            urls: [
                `Prefabs/dropItem/ExpBlock`,
                `Prefabs/dropItem/TrophyBlock`
            ]}],
            () => {},
            err => {
                console.log('经验块预设体加载')
            }
        );

        let rootNode: Node = new Node("DropItemBox");
        this.node.addChild(rootNode);
        this.rootNode = rootNode;

        console.log("DropItem Manager loaded");
        this._initRateMap();
    }

    start() {
        
    }

    private _initRateMap() {
        let emyList: any[] = EnemyManager.instance.getDBEnemyList(["id", "exp_drop_rate", "trophy_drop_rate", "exp_cnt"]);
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
        let emyRateData: any = this._emyRateMap[emyId];
        let dropExpCnt: number = this._dropExp(emyRateData);
        if (dropExpCnt) {
            let vecAry: Vec3[] = this._getRandomVec3Group(dropExpCnt, position);
            for (let i = 0; i < dropExpCnt; i++) {
                // 生成经验值预制体，在position周围掉落(掉落滑动动画)
                let expNode: Node = this.loadUINode("dropItem/ExpBlock", "ExpBlockCtrl");
                // TODO: 经验块大小随expCnt缩放
                expNode.angle = getRandomNumber(0, 360);
                expNode.OO_param1 = { targetVec: vecAry[i], expCnt: 1 };
                expNode.setPosition(position);
                this.appendUINode(expNode);
            }
        }

        let dropTrophy: number = this._dropTrophy(emyRateData);
        if (dropTrophy) {
            let vecAry: Vec3[] = this._getRandomVec3Group(1, position);
            let trophyNode: Node;
            switch (dropTrophy) {
                case TROPHY_TYPE.NORMAL: {
                    trophyNode = this.loadUINode("dropItem/TrophyBlock", "TrophyBlockCtrl");
                } break;
                case TROPHY_TYPE.CHESS: {

                } break;
                case TROPHY_TYPE.GREAT_CHESS: {

                } break;
            }
            if (trophyNode) {
                trophyNode.angle = getRandomNumber(0, 360);
                trophyNode.OO_param1 = {
                    targetVec: vecAry[0],
                    quality: dropTrophy
                };
                trophyNode.setPosition(position);
                this.appendUINode(trophyNode);
            }
        }
    }

    /**
     * 生成坐标组
     */
    private _getRandomVec3Group(n: number, position: Vec3): Vec3[] {
        // 上右下左，随机一个方向
        const dirGroup: any[] = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
        let dir: number[] = dirGroup[getRandomNumber(0, 3)];

        let deg: number = getFloatNumber(180 / n, 2);
        let vecAry: Vec3[] = [];
        // 半径
        const r: number = 0.8 * GP_UNIT;
        let skew: number = 0;
        for (let i = 1; i <= n; i++) {
            let cDeg: number = getFloatNumber(deg * i);
            let x: number = getFloatNumber(r * Math.cos(cDeg));
            let y: number = getFloatNumber(r * Math.sin(cDeg));

            if (!skew) {
                skew = Math.floor(x / 2);
            }

            // 随机偏移
            let skewX: number = getRandomNumber(skew, skew * 2) * [1, -1][getRandomNumber(0, 1)];
            let skewY: number = getRandomNumber(skew, skew * 2) * [1, -1][getRandomNumber(0, 1)];

            let newX: number = position.x + x * dir[0] + skewX;
            let newY: number = position.y + y * dir[1] + skewY;

            vecAry.push(v3(newX, newY));
        }

        return vecAry;
    }

    // 判断掉落经验 判断当前关卡的全局掉落修正
    private _dropExp(emyRateData: any): number {
        let expDropRate: number = emyRateData.exp_drop_rate;
        // 经验爆率修正
        let expDropAmend: number = this._chapterData.exp_drop_amend;

        let rate: number = expDropRate * expDropAmend;
        if (rate >= 1) {
            return emyRateData.exp_cnt;
        } else {
            return Math.random() <= rate ? emyRateData.exp_cnt : 0;
        }
    }
    // 是否掉落战利品
    private _dropTrophy(emyRateData: any): number {
        let trophyDropRate: number = emyRateData.trophy_drop_rate;
        // 战利品爆率修正
        let trophyDropAmend: number = this._chapterData.trophy_drop_amend;

        let rate: number = trophyDropRate * trophyDropAmend;
        // 0->无, 1->普通战利品, 2->普通箱子, 3->极品箱子
        if (rate >= 1) {
            return 1;
        } else {
            return Math.random() <= rate ? 1 : 0;
        }
    }

    update(deltaTime: number) {
        
    }
}


