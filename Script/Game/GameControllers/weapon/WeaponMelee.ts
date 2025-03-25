import { _decorator, AnimationClip, animation, UITransform, Size } from 'cc';
import { getFloatNumber, GP_UNIT } from '../../Common';
import { WeaponBase } from './WeaponBase';
import { BulletManager } from '../../CManager/BulletManager';
const { ccclass, property } = _decorator;

/**
 * 近战武器通用类
 * 
 * 武器攻击时，只是武器的图片部分做动画，武器的实际位置不变
 * 动画运动的原点为武器的实际位置
 * 攻速决定武器的攻击动画播放速度
 * 范围决定动画进入攻击判定帧时移动的距离，以及碰撞盒大小/位置
 * 2025.3.14
 * 为了更好的流畅度，近战武器只采用一张图片，使用动画引擎完成攻击动画
 * 将攻击类型分类：刺、砸...
 * 采用程序化编辑动画剪辑，https://blog.csdn.net/Hai_ou1011/article/details/144429985
 */
@ccclass('WeaponMelee')
export class WeaponMelee extends WeaponBase {
    protected onLoad(): void {
        super.onLoad();

        // 加载武器碰撞盒
        this._loadCollider();

        let animationClip: AnimationClip = new AnimationClip();
        // 整个动画的周期，动画周期由攻击速度决定
        animationClip.duration = 1;
        let track = new animation.VectorTrack();
        track.componentsCount = 3;
        track.path = new animation.TrackPath().toProperty("position");
        let [x, y] = track.channels();
        // 为 x 通道的曲线添加关键帧
        const frames = this._getAtkFrames();
        x.curve.assignSorted(frames);

        animationClip.addTrack(track);

        animationClip.name = "attack";
        animationClip.wrapMode = AnimationClip.WrapMode.Normal;

        // 关键帧索引
        const eventsFramsIdx = [3, 7];
        // 自定义事件
        animationClip.events = [
            { frame: frames[eventsFramsIdx[0]][0], func: "intoAtkFrame", params: [] },
            { frame: frames[eventsFramsIdx[1]][0], func: "endAtkFrame", params: [] }
        ];

        this.animationComp.addClip(animationClip);
    }

    private _loadCollider() {
        let nodeSize: Size = this.node.getComponent(UITransform).contentSize;
        let colliderTag: number = BulletManager.instance.getBulletTag(this.weaponData.bullet);

        // 碰撞盒由子脚本控制，因为这里无法触发 intoAtkFrame, endAtkFrame 方法
        this.views["PIC/SF"].OO_param1 = { nodeSize, colliderTag };
        this.views["PIC/SF"].addComponent("WeaponMeleeCollider");
    }

    private _getAtkFrames() {
        if (this.weaponData.atk_type === "stab") {
            return this._getStabAtkFrames();
        }
    }
    // 近战武器 -> “刺” 类武器的关键帧
    private _getStabAtkFrames() {
        let range = this.weaponData.panel.range * GP_UNIT;
        // 攻击动画时长
        let atkAniTime = getFloatNumber(this.weaponData.panel.atk_spd * 2 / 3, 3);
        // 原始动画帧（1秒基准）
        const stabAtkFrames = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1];
        // 原始位移帧（100范围基准）
        const stabMvFrames = [0, -10, -12, -14, 70, 85, 95, 100, 0];

        // 实际的攻击动画帧，结合原始动画帧和攻击动画时长决定
        let realFrames = []
        stabAtkFrames.forEach((frames, i) => {
            realFrames.push([getFloatNumber(frames * atkAniTime, 3), { value: stabMvFrames[i] * range / 100 }])
        });
        return realFrames;
    }

    start() {
        
    }

    // 由WeaponBase类调用
    protected playAttack(): void {
        super.playAttack();
        this.animationComp.play("attack");
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }
}
