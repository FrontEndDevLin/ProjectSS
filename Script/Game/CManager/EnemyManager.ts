import { _decorator, Component, Node, Prefab, v3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyManager')
export class EnemyManager extends OO_UIManager {
    static instance: EnemyManager = null;

    public abName: string = "GP";

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

    /**
     * 临时方法，现用于给玩家角色测试使用
     */
    public initEnemy() {
        let enemyNode = this.loadUINode("enemy/Enemy01");
        enemyNode.setPosition(v3(300, 300));
        this.appendUINode(enemyNode, this.rootNode);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}

