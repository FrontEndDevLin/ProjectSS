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
        CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_REDUCE_TINY, (err, tinySeconds) => {
            // console.log(tinySeconds);
            // tinySeconds结合当前规则进行刷怪
        }, this);
    }

    private _roleMap: any = {
        "timeNode": [
            { role: "normal", emy: 1, emyMax: 2 }
        ]
    }
    public setRoles(oRole: any) {
        console.log(oRole)
        let totalSeconds = oRole.seconds;
        let roles = oRole.roles;
        for (let role of roles) {
            console.log(role)
            let rfhTime = role.rfh_time;
            let fstRfhTime = role.fst_rfh_time || 0;
            // 0 --> 8
            let timeNodeStart = role.time_node_start || 0;
            let timeNodeEnd = role.time_node_end || totalSeconds;
            let startSeconds = totalSeconds - timeNodeStart - fstRfhTime;
            let endSeconds = totalSeconds - timeNodeStart - timeNodeEnd;
            console.log(startSeconds, endSeconds)
            // let rfhCnt = Math.floor(startSeconds / rfhTime);

            // let rfhSecondsList = [startSeconds];
            // for (let i = 1; i <= rfhCnt; i++) {
            //     rfhSecondsList.push( Number((startSeconds - rfhTime * i).toFixed(1)) )
            // }
            // console.log(rfhSecondsList)
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
        let x = -300;
        let y = 300;
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

