import { _decorator, Component, Node, Animation, AnimationClip } from 'cc';
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

let atk_spd = 0.5;

let weaponData = {
    frames: 10,
    bf_atk_frame: 0,
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
    private animateCtx: Animation = null;
    private animateClip: AnimationClip = null;

    start() {
        this.animateCtx = this.node.getComponent(Animation);
        this.animateClip = this.animateCtx.clips[0];

        this.animateCtx.getState(this.animateClip.name).speed = atk_ani_spd;
        
        this.animateCtx.play("weapon-001-atk-temp");
        // this.animateCtx.getComponent(AnimationClip)
    }

    update(deltaTime: number) {
        
    }
}


