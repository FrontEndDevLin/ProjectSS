/**
 * 程序入口文件
 */

import { _decorator, Component, Node, Prefab, SpriteFrame, PhysicsSystem2D, EPhysics2DDrawFlags, find } from 'cc';
import { Callback } from './Interface';
import OO_UIManager from '../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../OO/Manager/OO_ResourceManager';
import MapManager from './CManager/MapManager';
import CharacterManager from './CManager/CharacterManager';
import WeaponManager from './CManager/WeaponManager';
import { EventBus } from '../OO/Manager/OO_MsgManager';
import { OO_AddManager } from '../OO/OO_Manager';
import { BulletManager } from './CManager/BulletManager';
import { DBManager } from './CManager/DBManager';
import { EnemyManager } from './CManager/EnemyManager';
import { DamageManager } from './CManager/DamageManager';
import { ChapterManager } from './CManager/ChapterManager';
import { CountdownManager } from './CManager/CountdownManager';
import { StoreManager } from './CManager/StoreManager';
import { CharacterPropManager } from './CManager/CharacterPropManager';
import { ItemsManager } from './CManager/ItemsManager';

export default class Main extends Component {
    static instance: Main = null;

    onLoad() {
        if (!Main.instance) {
            Main.instance = this;
        } else {
            this.destroy();
            return;
        }

        EventBus.on("startGame", () => {
            this.startGame();
        });

        /**
         * Daylight
         * Heart Linked
         * Wild
         * TODO:
         *  道具系统
         *      限制数量类道具
         *  武器系统
         *      攻击动画: 帧动画
         *      远程武器攻击时生成子弹
         *      近战武器攻击时,根据帧动画生成子弹(不可视的)
         *          (研究一下近战攻击范围增加, 为什么会降低攻击速度)
         *          (并研究近战攻击速度增加的效果, 攻速可能会影响帧动画播放速度?)
         *      武器图标, 武器实际的图片
         *  设计
         *      几何风格，几何风格武器，几何弓，枪等
         *      角色呼吸，颜色呼吸，形状缩放
         *      几何道具，图标
         * 
         *  武器列表
         *      近战
         *          匕首、长剑、大剑、太刀
         *          拳、长茅、
         *          木棍、晨星锤、战斧、飞龙剑
         *      远程
         *          手枪、冲锋枪、霰弹枪、加特林、狙击枪
         *          弹弓、弩箭、弓箭、飞镖、飞刀
         * 
         *      先做一把武器（匕首），实现图标撑满(80x80)，gameplay图（50x50）（待机、攻击）
         *      帧动画如何结合范围？攻速？
         * 
         *      近战攻击动画
         *          获取当前攻速的 一半/三分之二 ，作为一次攻击的总时长（前摇、攻击时、后摇）
         *          假设武器的攻击帧动画有8帧（3帧前摇，3帧攻击时，2帧后摇）
         *          假设武器一次攻击总时长为0.8s
         *          则每一帧分配0.1s
         *          前摇阶段：除了前摇动画外，武器匀速位移到目标位置（和自己的范围属性有关）前。（武器的正常攻击范围处，每一个武器有自己的打击位置，这个属性是固定的）
         *          攻击时阶段：朝目标位置做攻击动画
         *          后摇阶段：除了后摇动画外，武器匀速位移回角色周边
         */

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape
    }

    public runGame(): void {
        return
        this.addCustomManager();

        this.preload((err) => {
            if (err) {
                return;
            }
            // OO_UIManager.instance.showUI("ItemsUI");
            // ChapterManager.instance.showCharacterSelect();
        });
    }

    addCustomManager() {
        OO_AddManager(DBManager);
        DBManager.instance.dbLoaded(err => {
            OO_AddManager(ChapterManager);
            OO_AddManager(CountdownManager);
            OO_AddManager(MapManager);
            OO_AddManager(CharacterManager);
            OO_AddManager(EnemyManager);
            OO_AddManager(WeaponManager);
            OO_AddManager(BulletManager);
            OO_AddManager(DamageManager);
            OO_AddManager(StoreManager);
            OO_AddManager(CharacterPropManager);
            OO_AddManager(ItemsManager);
        })
    }

    public startGame(): void {
        OO_UIManager.instance.removeUI("StartMenu");
    }

    protected preload(callback?: Callback): void {
        let pLoadPrefabs: string[] = [
            "Prefabs/CharacterSelect",
            "Prefabs/common/PanelItem",
            "Prefabs/common/PanelWrap",
            "Prefabs/common/CHTCard",
            "Prefabs/common/CHTMinCard",
            "Prefabs/common/LevCard",
            "Prefabs/StartMenu",
            "Prefabs/GamePlayUI",
            "Prefabs/Countdown",
            "Prefabs/Compass"
        ];
        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: pLoadPrefabs }], (total, current) => {
            // console.log(total, current)
        }, (err, data: any) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`预加载预设体"${pLoadPrefabs.join(",")}"完成`);

            if (callback) {
                callback(null)
            }
        })
    }
}
