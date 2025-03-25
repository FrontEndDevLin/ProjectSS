import { _decorator, BoxCollider2D, CircleCollider2D, Component, Contact2DType, Node, Size, Sprite, SpriteFrame, UITransform, v3, Vec3, Animation } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { GP_GROUP, WEAPON_DOMAIN } from '../../ColliderType';
import { Callback } from '../../Interface';
import { EnemyInfo, EnemyManager } from '../../CManager/EnemyManager';
import CharacterManager from '../../CManager/CharacterManager';
import { getVectorByAngle, GP_UNIT } from '../../Common';
import { ChapterManager } from '../../CManager/ChapterManager';
import WeaponManager from '../../CManager/WeaponManager';
import OO_ResourceManager from '../../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

/**
 * 基础武器类，包含武器的所有通用行为
 * 近战武器类、远程武器类都需要继承该类
 */
@ccclass('WeaponBase')
export class WeaponBase extends OO_Component {
    private _alertRangeCollider: CircleCollider2D = null;
    private _attackRangeCollider: CircleCollider2D = null;

    // 警戒范围内的敌人
    private _highEnemyList: string[] = [];
    // 攻击范围内的队列，当该队列中有敌人时，优先从中选择，性能会有提升
    private _dangerEnemyList: string[] = [];

    private _cd: number = 0;
    // 是否在攻击动画中
    private _animateAttacking: boolean = false;

    protected animationComp: Animation = null;
    public weaponId: string = "";
    public weaponData: any = null;

    protected onLoad(): void {
        super.onLoad();
        this.weaponId = this.node.OO_param1 ? this.node.OO_param1.weaponId : "";
        if (!this.weaponId) {
            return console.error("Missing param OO_param1.weaponId");
        }
        this.weaponData = WeaponManager.instance.getWeaponDataByWeaponId(this.weaponId);

        this._loadWeaponAsset();
        this._initRangeCollider();
    }

    start() {

    }

    // 渲染武器图片
    private _loadWeaponAsset() {
        let gamePic = OO_ResourceManager.instance.getAssets("GP", `Materials/weapon/${this.weaponData.game_pic}/spriteFrame`) as SpriteFrame;
        let picSize: Size = gamePic.originalSize;
        this.node.getComponent(UITransform).contentSize = picSize;
        this.views["PIC/SF"].getComponent(UITransform).contentSize = picSize;
        this.views["PIC/SF"].getComponent(Sprite).spriteFrame = gamePic;

        this.animationComp = this.views["PIC/SF"].addComponent(Animation);

        this.animationComp.on(Animation.EventType.FINISHED, (type, state) => {
            this._animateAttacking = false;
        });
    }

    // 武器警戒、攻击碰撞盒子处理
    private _initRangeCollider(): void {
        // 最好动态添加，目前是写死在节点上
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
        let { range, alert } = this.weaponData.panel;
        this._attackRangeCollider.radius = range * GP_UNIT;
        this._alertRangeCollider.radius = (range + alert) * GP_UNIT;
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
        if (this._animateAttacking) {
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
    
            console.log('攻击目标');
            // 远程武器播放攻击动画、发射弹体
            // 近战武器播放攻击动画、将自身变为碰撞体
            this.playAttack();
            this._cd = this.weaponData.panel.atk_spd;
        });
    }

    // 播放攻击动画, 在子类中实现
    protected playAttack() {
        this._animateAttacking = true;
    }

    protected onDestroy(): void {
        this._attackRangeCollider.off(Contact2DType.BEGIN_CONTACT, this._onWeaponDomainBeginContact, this);
        this._alertRangeCollider.off(Contact2DType.END_CONTACT, this._onWeaponDomainEndContact, this);
    }

    update(deltaTime: number) {
        if (ChapterManager.instance.onPlaying) {
            // 范围检测
            this._rotateWeapon();
    
            this._tryAttack(deltaTime);
        }
    }
}


