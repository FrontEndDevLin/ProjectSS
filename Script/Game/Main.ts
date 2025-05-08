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
         * 
         *  道具系统
         *      限制数量类道具
         *  武器系统
         *      武器图标单色白色，实际图片单色紫色
         *      武器图标, 武器实际的图片
         *      远程武器
         *  设计
         *      几何风格，几何风格武器，几何弓，枪等
         *      角色呼吸，颜色呼吸，形状缩放
         *      几何道具，图标
         *      避免太多颜色
         *      主角暖色调，敌人冷色调
         * 
         *  武器列表
         *      近战
         *          匕首、长剑、大剑、太刀
         *          拳、长矛、
         *          木棍、晨星锤、战斧、飞龙剑
         *      远程
         *          手枪、冲锋枪、霰弹枪、加特林、狙击枪
         *          弹弓、弩箭、弓箭、飞镖、飞刀
         * 
         * 
         *  UI设计
         *  游戏界面
         *      背景: #1A1A1A
         *      地面网格: #3D3D3D
         *      主角: #FFD54F
         *      主角武器/子弹: #9575CD
         *      敌人: #9575CD
         *      主角和敌人描边: #424242
         *      血条边框: #757575	
         *      血条背景: #424242
         *      血条填充：#FFD54F
         *      经验条填充: #80CBC4
         * 
         *      战利品: #80CBC4
         *      宝箱: #80CBC4
         * 
         * TODO:
         * GamePlay图标改成彩色 done
         * 掉落宝箱贴图设计 done
         * 所有单位加描边 done
         * 第1把远程武器（贴图，图标暂时不做，子弹发射粒子效果）
         *  贴图 done
         *  子弹 done
         *  子弹拖尾效果 done
         * 第1把近战武器 刺（贴图重做）done
         * 第2把近战武器 打击（贴图，动画，动画脚本）
         *  贴图
         *  动画
         *  动画脚本
         * 商店UI配色更换
         * 3把武器图标更换
         * 第2把远程武器（贴图、图标、动画、子弹与子弹粒子效果）
         * 子弹穿透属性
         * 第2把远程武器穿透(2)，伤害衰减
         * 商店刷新逻辑更换（刷武器和道具，目前只刷武器）done
         * 商店显示道具
         * 商店刷新功能（目前不消耗金币） done
         * 购买道具逻辑（buff角色，和开箱子逻辑一致）done
         * 高阶武器实现（实际是贴图相同，属性不同的另一件武器）
         * 高阶武器商店UI边框区分
         * 武器合成逻辑（合成方法实现，格子够时，相同武器不合成；不够时自动合成）
         * 第1个近战敌人设计（动画，数据）
         * 第1个远程敌人设计（动画，移动逻辑，发射子弹，数据）
         */

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape
    }

    public runGame(): void {
        this.addCustomManager();

        this.preload((err) => {
            if (err) {
                return;
            }
            // OO_UIManager.instance.showUI("ItemsUI");
            // 16.20.1
            // 20.13.1
            ChapterManager.instance.showCharacterSelect();
        });
    }

    addCustomManager() {
        OO_AddManager(DBManager);
        DBManager.instance.dbLoaded(err => {
            OO_AddManager(ChapterManager);
            OO_AddManager(CountdownManager);
            OO_AddManager(MapManager);
            OO_AddManager(CharacterManager);
            OO_AddManager(CharacterPropManager);
            OO_AddManager(EnemyManager);
            OO_AddManager(WeaponManager);
            OO_AddManager(BulletManager);
            OO_AddManager(DamageManager);
            OO_AddManager(StoreManager);
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
