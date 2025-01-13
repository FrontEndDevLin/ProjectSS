import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
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

    protected onLoad(): void {
        super.onLoad();

        let rootNode: Node = new Node("DropItemBox");
        this.node.addChild(rootNode);
        this.rootNode = rootNode;

        console.log("DropItem Manager loaded");
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


