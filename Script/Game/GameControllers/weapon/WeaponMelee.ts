import { _decorator, Component, Node, Animation, AnimationClip, animation } from 'cc';
import { OO_Component } from '../../../OO/OO';
const { ccclass, property } = _decorator;

// 近战一次攻击为10帧，耗时1秒（标准），速度为1

// 近战攻击动画
// 获取当前攻速的 一半/三分之二 ，作为一次攻击的总时长（前摇、攻击时、后摇）
// 假设武器的攻击帧动画有8帧（3帧前摇，3帧攻击时，2帧后摇）
// 假设武器一次攻击总时长为0.8s
// 则每一帧分配0.1s
// 前摇阶段：除了前摇动画外，武器匀速位移到目标位置（和自己的范围属性有关）前。（武器的正常攻击范围处，每一个武器有自己的打击位置，这个属性是固定的）
// 攻击时阶段：朝目标位置做攻击动画
// 后摇阶段：除了后摇动画外，武器匀速位移回角色周边

// 面板攻速
let atk_spd = 0.5;

let weaponData = {
    frames: 10,
    atk_frame: 4,
    aft_atk_frame: 7
}
// 攻击动画时长
let atk_ani_time = atk_spd * 2 / 3;
// 根据攻击动画时长，调整播放速度
let atk_ani_spd = Number((1 / atk_ani_time).toFixed(3));

/**
 * 近战武器通用类
 */
@ccclass('WeaponMelee')
export class WeaponMelee extends OO_Component {
    // private animateCtx: Animation = null;
    // private animateClip: AnimationClip = null;

    /**
     * 武器攻击时，只是武器的图片部分做动画，武器的实际位置不变
     * 动画运动的原点为武器的实际位置
     * 攻速决定武器的攻击动画播放速度
     * 范围决定动画进入攻击判定帧时移动的距离，以及碰撞盒大小/位置
     * 攻击进入后摇阶段时，获得后摇的总时间，将动画收回（武器回到手上）
     * 
     * 
     * 2025.3.14
     * 为了更好的流畅度，近战武器只采用一张图片，使用动画引擎完成攻击动画
     * 将攻击类型分类：刺、砸...
     * 采用程序化编辑动画剪辑，https://blog.csdn.net/Hai_ou1011/article/details/144429985
     * 使用更多的帧率（20+）
     * 
     */

    protected onLoad(): void {
        let animationComp: Animation = this.node.addComponent(Animation);

        let animationClip: AnimationClip = new AnimationClip();
        // 整个动画的周期
        animationClip.duration = 1;
        
        let track = new animation.VectorTrack();
        track.componentsCount = 3;
        track.path = new animation.TrackPath().toProperty("position");
        let [x, y] = track.channels();
        x.curve.assignSorted([ // 为 x 通道的曲线添加关键帧
            [0, ({ value: 0 })],
            [1, ({ value: 70 })]
        ]);

        animationClip.addTrack(track);

        animationClip.name = "test1";
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;

        animationComp.addClip(animationClip);

        animationComp.play("test1");
    }

    start() {
        // this.animateCtx = this.node.getComponent(Animation);
        // this.animateClip = this.animateCtx.clips[0];
        // // this.animateClip.tracks
        // // console.log(this.animateClip.getTrack(0))
        // this.animateCtx.getState(this.animateClip.name).speed = atk_ani_spd;
        // this.animateCtx.play("weapon-001-atk-temp");
        // this.animateCtx.getComponent(AnimationClip)
    }

    public intoAtkFrame() {
        // console.log('进入攻击判定帧')
    }

    update(deltaTime: number) {
        
    }
}


