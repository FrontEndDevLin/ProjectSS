import { _decorator, Component, Node, Animation, AnimationClip, animation, BoxCollider, Vec3, UITransform, Size, BoxCollider2D } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { DBManager } from '../../CManager/DBManager';
const { ccclass, property } = _decorator;

// 近战一次攻击设计基准耗时1秒，速度为1
// 当武器结束攻击前摇时，开启攻击判定，进入攻击后摇时结束攻击判定

// 面板攻速
let atk_spd = 0.5;

let db = {
    "Weapon001-dagger-temp": {
        id: "Weapon001-dagger-temp",
        name: "测试匕首",
        icon: "",
        game_pic: "weapon-001-dagger",
        type: "melee",
        panel: {
            range: 120,
            atk_spd: 1.04,
            dmg: 10
        },
        atk_type: "stab",
        atk_type_desc: "stab -> 刺"
    }
}

const weaponData = db["Weapon001-dagger-temp"];

// 攻击动画时长
let atk_ani_time = weaponData.panel.atk_spd * 2 / 3;

// TODO: 根据攻击范围决定位移的值（算法？）
const stab_atk_frames = [
    [0, 0],
    [0.1, -10],
    [0.2, -12],
    [0.1, 0],
    [0.1, 0],
    [0.1, 0],
]

/**
 * 近战武器通用类
 */
@ccclass('WeaponMelee')
export class WeaponMelee extends OO_Component {
    // private animateCtx: Animation = null;
    // private animateClip: AnimationClip = null;
    private colliderNode: Node = null;

    /**
     * 武器攻击时，只是武器的图片部分做动画，武器的实际位置不变
     * 动画运动的原点为武器的实际位置
     * 攻速决定武器的攻击动画播放速度
     * 范围决定动画进入攻击判定帧时移动的距离，以及碰撞盒大小/位置
     * 2025.3.14
     * 为了更好的流畅度，近战武器只采用一张图片，使用动画引擎完成攻击动画
     * 将攻击类型分类：刺、砸...
     * 采用程序化编辑动画剪辑，https://blog.csdn.net/Hai_ou1011/article/details/144429985
     */

    protected onLoad(): void {
        // 创建碰撞盒
        this.colliderNode = new Node('ColliderNode')
        this.node.addChild(this.colliderNode);
        let uiTransform = this.colliderNode.addComponent(UITransform);
        const collider = this.colliderNode.addComponent(BoxCollider2D);
        let nodeSize: Size = this.node.getComponent(UITransform).contentSize;
        uiTransform.contentSize = nodeSize;
        uiTransform.anchorX = 0.5;
        uiTransform.anchorY = 0.5;
        collider.size = nodeSize;
        this.colliderNode.active = false;

        let animationComp: Animation = this.node.addComponent(Animation);

        let animationClip: AnimationClip = new AnimationClip();
        // 整个动画的周期，动画周期由攻击速度决定
        animationClip.duration = 1;
        
        let track = new animation.VectorTrack();
        track.componentsCount = 3;
        track.path = new animation.TrackPath().toProperty("position");
        let [x, y] = track.channels();
        x.curve.assignSorted([ // 为 x 通道的曲线添加关键帧
            [0, { value: 0 }],
            [0.1, { value: -10 }],
            [0.2, { value: -12 }],
            [0.3, { value: -14 }],
            [0.4, { value: 40 }],
            [0.5, { value: 55 }],
            [0.6, { value: 65 }],
            [0.7, { value: 70 }],
            [1, { value: 0 }]
        ]);

        animationClip.addTrack(track);

        animationClip.name = "test1";
        animationClip.wrapMode = AnimationClip.WrapMode.Normal;

        // 自定义事件
        animationClip.events = [
            { frame: 0.3, func: "intoAtkFrame", params: [] },
            { frame: 0.7, func: "endAtkFrame", params: [] }
        ]

        animationComp.addClip(animationClip);

        animationComp.play("test1");
    }

    start() {
        
    }

    public intoAtkFrame() {
        console.log('进入攻击判定帧')
        this.colliderNode.active = true;
    }
    public endAtkFrame() {
        console.log('离开攻击判定帧')
        this.colliderNode.active = false;
    }

    update(deltaTime: number) {
    }
}


