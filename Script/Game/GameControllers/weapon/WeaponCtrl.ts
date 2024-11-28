import { _decorator, Component, Node, Animation, Vec3, UITransform, v3, Contact2DType, CircleCollider2D, BoxCollider2D } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { BulletManager } from '../../CManager/BulletManager';
import CharacterManager from '../../CManager/CharacterManager';
import { getVectorByAngle, GP_UNIT } from '../../Common';
import { GP_GROUP, WEAPON_DOMAIN } from '../../ColliderType';
import { EnemyInfo, EnemyManager } from '../../CManager/EnemyManager';
import { Callback } from '../../Interface';
const { ccclass, property } = _decorator;

/**
 * 通用武器控制类
 * 特殊武器需要继承该类
 * 
 * 武器在做出攻击动画时不可转向
 */

@ccclass('WeaponCtrl')
export class WeaponCtrl extends OO_Component {
    public weaponPanel: any = {};

    private _animation: Animation = null;

    private _alertRangeCollider: CircleCollider2D = null;
    private _attackRangeCollider: CircleCollider2D = null;

    // 警戒范围内的敌人
    private _highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    private _dangerEnemyList: string[] = [];

    private _cd: number = 0;
    // 是否在攻击动画中
    private _attacking: boolean = false;

    // 弹头考虑分出单独的类管理
    public buildWarhead() {

    }

    protected onLoad(): void {
        super.onLoad();

        console.log('通用武器脚本挂载！')

        // console.log(this.node)
        // this.node.name -> weapon name
        // 

        // 远程类型
        if (this.weaponPanel.type === 1) {
            // 当前是远程类型，需要弹头管理
        }
        this._animation = this.views["PIC"].getComponent(Animation);
        this._animation.on(Animation.EventType.FINISHED, (type, state) => {
            // console.log(type, state)
            this._attacking = false;
        });

        // 武器警戒、攻击碰撞盒子处理
        let colliders: CircleCollider2D[] = this.node.getComponents(CircleCollider2D);
        for (let collider of colliders) {
            switch (collider.tag) {
                case WEAPON_DOMAIN.ALERT: {
                    this._alertRangeCollider = collider;
                } break;
                case WEAPON_DOMAIN.ATTACK: {
                    this._attackRangeCollider = collider;
                } break;
            }
            collider.on(Contact2DType.BEGIN_CONTACT, this._onWeaponDomainBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this._onWeaponDomainEndContact, this);
        }
        let { range, alert } = this.weaponPanel;
        this._attackRangeCollider.radius = range * GP_UNIT;
        this._alertRangeCollider.radius = (range + alert) * GP_UNIT;
    }

    start() { }
    protected onDestroy(): void {
        this._attackRangeCollider.off(Contact2DType.BEGIN_CONTACT, this._onWeaponDomainBeginContact, this);
        this._alertRangeCollider.off(Contact2DType.END_CONTACT, this._onWeaponDomainEndContact, this);
    }

    private _onWeaponDomainBeginContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GP_GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case WEAPON_DOMAIN.ALERT: {
                    // 将敌人放入队列中，结束碰撞时将敌人移出
                    this._highEnemyList[otherCollider.node.uuid] = 1;
                } break;
                case WEAPON_DOMAIN.ATTACK: {
                    this._dangerEnemyList[otherCollider.node.uuid] = 1;
                } break;
            }
        }
    }
    private _onWeaponDomainEndContact(selfCollider: CircleCollider2D, otherCollider: BoxCollider2D) {
        if (otherCollider.group === GP_GROUP.ENEMY) {
            switch (selfCollider.tag) {
                case WEAPON_DOMAIN.ALERT: {
                    delete this._highEnemyList[otherCollider.node.uuid];
                } break;
                case WEAPON_DOMAIN.ATTACK: {
                    delete this._dangerEnemyList[otherCollider.node.uuid];
                } break;
            }
        }
    }
    // 每帧检查队列中对应节点距离角色的距离
    private _chooseTarget(callback: Callback) {
        // 优先判断攻击范围内的敌人
        if (Object.keys(this._dangerEnemyList).length) {
            let target: EnemyInfo = EnemyManager.instance.getNearestEnemy(this._dangerEnemyList);
            callback(true, target);
            return;
        }
        // 攻击范围内无敌人，再判断警戒范围内的敌人
        if (Object.keys(this._highEnemyList).length) {
            let target: EnemyInfo = EnemyManager.instance.getNearestEnemy(this._highEnemyList);
            callback(false, target);
            return;
        }
    }
    // 旋转武器(改变贴图朝向)
    private _rotateWeapon() {
        if (this._attacking) {
            return;
        }
        this._chooseTarget((hasAtkTarget: boolean, target: EnemyInfo) => {
            if (!target) {
                return;
            }

            // 武器指向离得最近的目标
            let characterLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
            // 将武器坐标转为地图坐标
            let currentVec: Vec3 = v3(characterLoc.x + this.node.position.x, characterLoc.y + this.node.position.y);
            let vecX = target.x - currentVec.x;
            let vecY = target.y - currentVec.y;

            let angle = Number((Math.atan(vecY / vecX) * 57.32).toFixed(2));

            let scaleX = 1;
            if (vecX < 0) {
                scaleX = -1;
            }

            this.views["PIC"].angle = angle;
            this.views["PIC"].setScale(v3(scaleX, 1));
        });
    }

    initAttr(attr) {
        this.weaponPanel = attr;
    }

    private _tryAttack(dt: number) {
        if (this._cd <= 0) {
            this._attack(dt);
        } else {
            this._cd -= dt;
        }
    }
    private _attack(dt: number): void {
        this._chooseTarget((hasAtkTarget: boolean, target: EnemyInfo) => {
            if (!hasAtkTarget || !target) {
                return;
            }
    
            // 通知BulletManager发射子弹，带上当前坐标，向量
            // 坐标为当前坐标转化为世界坐标，向量为当前节点的方向
            let { x, y } = this.node.position;
            // 获取当前角色的坐标, 与武器坐标相加，得到武器的世界坐标
            const ctLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
            if (!ctLoc) {
                return;
            }
            let worldLoc: Vec3 = v3(ctLoc.x + x, ctLoc.y + y);
            // 向量要根据贴图的旋转角度计算
            let angle = this.views["PIC"].angle;
            if (this.views["PIC"].getScale().x === -1) {
                angle -= 180;
            }
            let vector = getVectorByAngle(angle);
            BulletManager.instance.createBullet(this.weaponPanel.bullet, worldLoc, vector);
            this._playAttackAni();
            this._cd = this.weaponPanel.atk_speed;
        });
    }
    // 播放攻击动画
    private _playAttackAni() {
        const atk_speed = this.weaponPanel.atk_speed;
        this._attacking = true;
        // TODO: 攻击动画随着攻速变化而变化
        // TODO: 攻击动画用帧动画，目前的效果有问题
        this._animation.play(`${this.weaponPanel.id}-atk`);
    }

    update(deltaTime: number) {
        // 范围检测
        this._rotateWeapon();

        this._tryAttack(deltaTime);
    }
}

