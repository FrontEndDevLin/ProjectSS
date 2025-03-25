import { _decorator, AnimationClip, Component, Node, v3, Vec3 } from 'cc';
import { WeaponBase } from './WeaponBase';
import CharacterManager from '../../CManager/CharacterManager';
import { getVectorByAngle } from '../../Common';
import { BulletManager } from '../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 远程武器通用类
 */
@ccclass('WeaponRange')
export class WeaponRange extends WeaponBase {
    protected onLoad(): void {
        super.onLoad();

        // TODO: 在这里做远程武器攻击动画组件
        let animationClip: AnimationClip = new AnimationClip();
        // 整个动画的周期，动画周期由攻击速度决定
        animationClip.duration = 1;
    }

    start() {

    }

    protected playAttack(): void {
        super.playAttack();

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
        // TODO:
        BulletManager.instance.createBullet(this.weaponData.bullet, worldLoc, vector);
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}


