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
         * TODO: 先做近战武器
         *  武器增加属性: 伤害加成 done
         *  近战武器面板计算，受“近战伤害”、“伤害”修正 done
         *  触发更新武器面板 done
         *  第二把近战武器 “长矛” “刺” (画图即可)
         *  第三把近战武器 “长剑” “挥砍” (画图+设计挥砍动作)
         *  商店界面显示武器图标
         *  远程武器设计
         *      第一把远程武器“手枪” done
         *      第二把远程武器“弩” 
         *  
         * TODO:
         *  道具系统
         *      限制数量类道具
         *  武器系统
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
         *      血条边框: #757575	
         *      血条背景: #424242
         *      血条填充：#FFD54F
         *      经验条填充: #80CBC4
         * 
         *      战利品: #80CBC4
         *      宝箱: #80CBC4
         * 
         * 库存，金币图标更换 40*36 done
         * 掉落物图标：材料(多个不规则矩形) done、战利品(十字架) done、宝箱 
         * 右上角图标：升级、宝箱
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
