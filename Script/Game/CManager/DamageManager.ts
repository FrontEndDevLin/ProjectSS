import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

/**
 * 伤害计算管理
 * 提供伤害计算接口，通过传入弹头数据，角色面板，敌人数据进行计算
 * 提供显示伤害功能，传入伤害值、坐标，在对应位置显示伤害文本
 */
@ccclass('DamageManager')
export class DamageManager extends OO_UIManager {
    static instance: DamageManager = null;

    protected onLoad(): void {
        if (!DamageManager.instance) {
            DamageManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Damage Manager launch");
    }

    public calcDamage(bulletAttr, panel, enemyAttr) {
        if (true) {
            this._showDamageTxt();
        }
        return 5;
    }
    private _showDamageTxt() {
        
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


