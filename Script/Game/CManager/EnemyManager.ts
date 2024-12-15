import { _decorator, Component, Node, Prefab, v3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { COUNTDOWN_EVENT, CountdownManager } from './CountdownManager';
const { ccclass, property } = _decorator;

export interface EnemyInfo {
    x?: number,
    y?: number,
    dis?: number,
    alive: number
}
interface EnemyMap {
    [uuid: string]: EnemyInfo
}

/**
 * R5 5600  519
 * 寒冰100  18.8
 * 微星A520  380.07  -> 华南A520  268
 * 铭瑄16g 3200  132  -> 索奈特16g 3200  114
 * 铠侠500g nvme  225  -> 科赋256g  99
 * 1T蓝盘  185.71  -> 2手1t  97
 * 6750gre  1777 -> 6650xt  1598
 * 玄武550v4  199
 * 海景房机箱  57.42
 * 
 * 3494 -> 2970
 */

@ccclass('EnemyManager')
export class EnemyManager extends OO_UIManager {
    static instance: EnemyManager = null;

    public abName: string = "GP";

    /**
     * 维护一个敌人map表，每一帧更新坐标和是否存活，当敌人被消灭后，播放完阵亡动画后从表中移除
     */
    public enemyMap: EnemyMap = {};

    protected onLoad(): void {
        if (!EnemyManager.instance) {
            EnemyManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Enemy Manager loaded")

        // 加载所有敌人预设
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/enemy/Enemy01`] }], () => {}, err => {
            console.log("敌人预设体加载完毕")
        })
    }

    public startListen() {
        CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_REDUCE_TINY, this._loadEnemy, this);
    }

    private _roleMap: any = {
        // "timeNode": [
        //     { role: "normal", emy: 1, emyMax: 2 }
        // ]
    }
    public setRoles(oRole: any): boolean {
        // console.log(oRole)
        let totalSeconds = oRole.seconds;
        let roles = oRole.roles;
        for (let role of roles) {
            // 刷新间隔
            let rfhTime = role.rfh_time;
            // 首次刷出延迟时间
            let fstRfhTime = role.fst_rfh_time || 0;
            // 首次刷出时间点
            let startTime = (role.time_node_start || totalSeconds) - fstRfhTime;
            // 结束刷出时间点
            let endTime = role.time_node_end || 0;
            // 刷出波次
            let rfhCnt = Math.floor((startTime - endTime) / rfhTime);
            let rfhSecondsList = [startTime];
            for (let i = 1; i <= rfhCnt; i++) {
                rfhSecondsList.push( Number((startTime - rfhTime * i).toFixed(1)) )
            }
            rfhSecondsList.forEach(seconds => {
                if (!this._roleMap[seconds]) {
                    this._roleMap[seconds] = [role];
                } else {
                    this._roleMap[seconds].push(role);
                }
            })
        }
        return true;
    }
    private _loadEnemy(err, seconds: number) {
        if (this._roleMap.hasOwnProperty(seconds)) {
            let timeRoles = this._roleMap[seconds];

            timeRoles.forEach(enemyItem => {
                let max = enemyItem.emy_max;
                let min = enemyItem.emy_min || max;
                let enemyCount = 0;
                if (max === min) {
                    enemyCount = max;
                } else {
                    enemyCount = Math.floor(Math.random() * (max - min + 1) + min);
                }
                // console.log(`生成${enemyCount}个敌人`)
                for (let i = 0; i < enemyCount; i++) {
                    this.createEnemy()
                }
            })
        }
    }

    /**
     * 临时方法，现用于给玩家角色测试使用
     */
    public initEnemy() {
        this.createEnemy();
    }

    public createEnemy() {
        let enemyNode = this.loadUINode("enemy/Enemy01", "EnemyCtrl");
        // 临时
        let x = Math.floor(Math.random() * 600) - 300;
        let y = Math.floor(Math.random() * 600) - 300;
        enemyNode.setPosition(v3(x, y));
        this.enemyMap[enemyNode.uuid] = { x, y, dis: 0, alive: 1 };
        this.appendUINode(enemyNode, this.rootNode);
    }
    public updateEnemy(uuid: string, enemyInfo: EnemyInfo) {
        for (let k in enemyInfo) {
            this.enemyMap[uuid][k] = enemyInfo[k];
        }
    }
    public removeEnemy(uuid: string) {
        delete this.enemyMap[uuid];
    }
    public getNearestEnemy(uuidList: string[]): EnemyInfo {
        let min: number = 0;
        let target: string = null;
        for (let uuid in uuidList) {
            let dis = this.enemyMap[uuid].dis;
            if (!target) {
                min = dis;
                target = uuid;
            } else {
                if (dis < min) {
                    min = dis;
                    target = uuid;
                }
            }
        }
        return this.enemyMap[target];
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

