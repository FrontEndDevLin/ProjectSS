import { _decorator, Component, Label, Node, Prefab, Vec3, Animation } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

/**
 * 伤害计算管理
 * 提供伤害计算接口，通过传入弹头数据，角色面板，敌人数据进行计算
 * 提供显示伤害功能，传入伤害值、坐标，在对应位置显示伤害文本
 */
@ccclass('DamageManager')
export class DamageManager extends OO_UIManager {
    static instance: DamageManager = null;
    public rootNode: Node = null;

    protected onLoad(): void {
        if (!DamageManager.instance) {
            DamageManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Damage Manager launch");

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/DmgTxt`] }], () => {}, err => {
            console.log('伤害数字预设体加载完毕')
        })

        let rootNode: Node = new Node("DmgTxtBox");
        this.node.addChild(rootNode);
        this.rootNode = rootNode;
    }

    // 原本的计算武器伤害（作废）
    public calcBulletDamage(bulletId: string) {
        // TODO: 结合角色面板
        return 5;
    }
    // 打中敌人时计算伤害
    public calcDamage(damage, enemyAttr?) {
        // TODO:
        return damage;
    }
    public showDamageTxt(damage: number, position: Vec3) {
        if (true) {
            let dmgTxtNode: Node = this.loadUINode("DmgTxt");
            dmgTxtNode.OO_param1 = {
                damage,
                position
            };
            this.appendUINode(dmgTxtNode);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


