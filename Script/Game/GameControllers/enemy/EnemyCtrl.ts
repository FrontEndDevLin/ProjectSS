import { _decorator, BoxCollider2D, Component, Contact2DType, Node, Vec3 } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { EnemyManager } from '../../CManager/EnemyManager';
import CharacterManager from '../../CManager/CharacterManager';
import { GP_GROUP } from '../../ColliderType';
import { BulletManager } from '../../CManager/BulletManager';
import { DamageManager } from '../../CManager/DamageManager';
const { ccclass, property } = _decorator;

@ccclass('EnemyCtrl')
export class EnemyCtrl extends OO_Component {
    private _alive: boolean = true;

    private _collider: BoxCollider2D = null;
    // temp
    private _hp: number = 8;

    start() {

    }

    protected onLoad(): void {
        super.onLoad();

        this._collider = this.node.getComponent(BoxCollider2D);

        this._collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContact, this);
    }
    private _onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D) {
        switch (otherCollider.group) {
            case GP_GROUP.BULLET: {
                // TODO: 显示伤害由一个类单独管理
                // 当前阶段敌人直接死，伤害随意计算
                // 通过tag获取弹头数据（tag也存在弹头db里），获取的弹头数据要经过角色面板的补正
                // console.log('被击中，扣血' + )
                let bulletDamage: number = BulletManager.instance.getBulletDamage(otherCollider.tag);
                // attr是自己的属性
                let attr = null;
                let realDamage: number = DamageManager.instance.calcDamage(bulletDamage, attr);
                this._hp -= realDamage;
                DamageManager.instance.showDamageTxt(realDamage, this.node.position);
                if (this._hp <= 0) {
                    this.die();
                }
            } break;
            case GP_GROUP.CHARACTER: {
                console.log('击中角色')
            } break;
        }
    }

    public die() {
        this.node.destroy();
    }

    update(deltaTime: number) {
        if (this._alive) {
            let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
            let cX = characterLoc.x;
            let cY = characterLoc.y;
            let { x, y } = this.node.position;
            let dis = Math.sqrt(Math.pow(x - cX, 2) + Math.pow(y - cY, 2));
            EnemyManager.instance.updateEnemy(this.node.uuid, {
                alive: 1,
                dis,
                x,
                y
            });
        }
    }
}

