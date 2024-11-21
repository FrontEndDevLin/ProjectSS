import { _decorator, Component, Node, Animation, Vec3, UITransform, v3, CircleCollider2D, Contact2DType } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { BulletManager } from '../../CManager/BulletManager';
import CharacterManager from '../../CManager/CharacterManager';
import { GP_UNIT } from '../../Common';
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

        this._animation = this.node.getComponent(Animation);

        this._alertRangeCollider = this.node.getComponent(CircleCollider2D);

        let alertRange: number = this.weaponPanel.range + this.weaponPanel.alert;
        this._alertRangeCollider.radius = alertRange * GP_UNIT;
        this._alertRangeCollider.on(Contact2DType.BEGIN_CONTACT, this._onARangeBeginContact)
    }

    private _onARangeBeginContact(selfCollider, otherCollider) {
        console.log('碰撞到了')
    }

    start() {

    }

    initAttr(attr) {
        this.weaponPanel = attr;
    }

    // 范围检测，范围暂定为当前攻击范围+alert
    public rangeCheck(dt: number): boolean {
        if (this._attacking) {
            return false;
        }
        // TODO: 检测是否有目标在警示范围内，有则旋转武器角度
        return true;
    }

    private _cd: number = 0;
    // 是否在攻击动画中
    private _attacking: boolean = false;
    public attack(dt: number): void {
        if (this._cd <= 0) {
            // attack
            // 通知BulletManager发射子弹，带上当前坐标，向量
            // 坐标为当前坐标转化为世界坐标，向量为当前节点的方向
            let { x, y } = this.node.position;
            // 获取当前角色的坐标, 与武器坐标相加，得到武器的世界坐标
            const ctLoc: Vec3 = CharacterManager.instance.getCharacterLoc();
            if (!ctLoc) {
                return;
            }
            let worldLoc: Vec3 = v3(ctLoc.x + x, ctLoc.y + y);
            let vector = v3(this.node.position).normalize();
            BulletManager.instance.createBullet(this.weaponPanel.bullet, worldLoc, vector);
            this._playAttackAni();
            this._cd = this.weaponPanel.atk_speed;
        } else {
            this._cd -= dt;
        }
    }
    // 播放攻击动画
    private _playAttackAni() {
        const atk_speed = this.weaponPanel.atk_speed;
        // 攻击动画随着攻速变化而变化
        this._animation.play(`${this.weaponPanel.weaponName}-atk`);
    }

    update(deltaTime: number) {
        // 范围检测
        let inRange: boolean = this.rangeCheck(deltaTime);

        // 进入范围，判断冷却时间
        if (inRange) {
            this.attack(deltaTime);
        }
    }
}

