import { _decorator, Component, Node, Animation, AnimationClip, animation, BoxCollider, Vec3, UITransform, Size, BoxCollider2D, v2, SpriteFrame, Sprite } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { DBManager } from '../../CManager/DBManager';
import { getFloatNumber } from '../../Common';
import OO_ResourceManager from '../../../OO/Manager/OO_ResourceManager';
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

/**
 * 近战武器通用类
 */
@ccclass('WeaponMelee')
export class WeaponMelee extends OO_Component {
    // private animateCtx: Animation = null;
    // private animateClip: AnimationClip = null;
    private _colliderNode: Node = null;

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
        OO_ResourceManager.instance.preloadResPkg([{
            abName: "GP",
            assetType: SpriteFrame,
            urls: ["Materials/weapon/weapon-001-dagger/spriteFrame"]
        }], () => {}, err => {
            // 渲染武器图片
            this._loadWeaponAsset();
            // 加载武器碰撞盒
            this._loadCollider();

            let animationComp: Animation = this.node.addComponent(Animation);

            let animationClip: AnimationClip = new AnimationClip();
            // 整个动画的周期，动画周期由攻击速度决定
            animationClip.duration = 1;
            let track = new animation.VectorTrack();
            track.componentsCount = 3;
            track.path = new animation.TrackPath().toProperty("position");
            let [x, y] = track.channels();
            // 为 x 通道的曲线添加关键帧
            const frames = getAtkFrames("Weapon001-dagger-temp");
            x.curve.assignSorted(frames);

            animationClip.addTrack(track);

            animationClip.name = "test1";
            animationClip.wrapMode = AnimationClip.WrapMode.Normal;

            // 关键帧索引
            const eventsFramsIdx = [3, 7];
            // 自定义事件
            animationClip.events = [
                { frame: frames[eventsFramsIdx[0]][0], func: "intoAtkFrame", params: [] },
                { frame: frames[eventsFramsIdx[1]][0], func: "endAtkFrame", params: [] }
            ];

            animationComp.addClip(animationClip);

            animationComp.play("test1");
        });
    }

    private _loadWeaponAsset() {
        let gamePic = OO_ResourceManager.instance.getAssets("GP", "Materials/weapon/weapon-001-dagger/spriteFrame") as SpriteFrame;
        this.node.getComponent(UITransform).contentSize = new Size(gamePic.width, gamePic.height);
        let spriteComp: Sprite = this.node.addComponent(Sprite);
        spriteComp.spriteFrame = gamePic;
    }

    private _loadCollider() {
        // 创建碰撞盒
        this._colliderNode = new Node("WpCollider");
        this.node.addChild(this._colliderNode);
        let uiTransform = this._colliderNode.addComponent(UITransform);
        const collider = this._colliderNode.addComponent(BoxCollider2D);
        let nodeSize: Size = this.node.getComponent(UITransform).contentSize;
        uiTransform.contentSize = nodeSize;
        uiTransform.anchorPoint = v2(0.5, 0.5);
        collider.size = nodeSize;
        this._colliderNode.active = false;
    }

    start() {
        
    }

    public intoAtkFrame() {
        // console.log('进入攻击判定帧')
        this._colliderNode.active = true;
    }
    public endAtkFrame() {
        // console.log('离开攻击判定帧')
        this._colliderNode.active = false;
    }

    update(deltaTime: number) {
    }
}

const getAtkFrames = (weaponId: string) => {
    const weaponData = db[weaponId];
    if (weaponData.atk_type === "stab") {
        return getStabAtkFrames(weaponId);
    }
}

// 近战武器 -> “刺” 类武器的关键帧
const getStabAtkFrames = (stabWeaponId: string) => {
    const weaponData = db[stabWeaponId];
    let range = weaponData.panel.range;
    // 攻击动画时长
    let atkAniTime = getFloatNumber(weaponData.panel.atk_spd * 2 / 3, 3);
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
