import { _decorator, animation, Animation, AnimationClip, Component, Node, v3, Vec3 } from 'cc';
import { WeaponBase } from './WeaponBase';
import CharacterManager from '../../CManager/CharacterManager';
import { getFloatNumber, getVectorByAngle } from '../../Common';
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
    
        const realFrames = this._getGunAtkFrames();

        // 整个动画的周期，动画周期由攻击速度决定
        animationClip.duration = realFrames.aniTime;
        // 旋转轨道
        let rotateTrack = new animation.RealTrack();
        rotateTrack.path = new animation.TrackPath().toProperty("angle");
        rotateTrack.channel.curve.assignSorted(realFrames.rotateTrack);
        animationClip.addTrack(rotateTrack);

        // 位移轨道
        let vecTrack = new animation.VectorTrack();
        vecTrack.componentsCount = 3;
        vecTrack.path = new animation.TrackPath().toProperty("position");
        let [x, y] = vecTrack.channels();
        x.curve.assignSorted(realFrames.vecTrack);
        animationClip.addTrack(vecTrack);

        animationClip.name = "attack";
        animationClip.wrapMode = AnimationClip.WrapMode.Normal;

        this.animationComp.addClip(animationClip);
    }

    start() {

    }

    protected playAttack(): void {
        super.playAttack();

        this.animationComp.play("attack");
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

    // 获取枪类攻击帧
    private _getGunAtkFrames() {
        // 攻击动画时长
        let atkAniTime = getFloatNumber(this.weaponData.panel.atk_spd * 2 / 3, 3);
        // 攻击动画帧（1秒基准）
        const baseAtkFrames: number[] = [0.2, 0.3, 1];
        const gunAngleFrames: number[] = [5, 15, 0];
        const gunVecXFrames: number[] = [0, -10, 0];
        let realAngleFrames = [];
        let realVecXFrames = [];
        baseAtkFrames.forEach((frames, i) => {
            let realFrameTime: number = getFloatNumber(frames * atkAniTime, 3);
            realAngleFrames.push([realFrameTime, gunAngleFrames[i]]);
            realVecXFrames.push([realFrameTime, gunVecXFrames[i]]);
        });

        return {
            aniTime: atkAniTime,
            rotateTrack: realAngleFrames,
            vecTrack: realVecXFrames
        }
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}


