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
         *      道具页面（点击某个道具会有说明）
         *      升级时可查看道具页面
         *      道具列表功能实现
         *      道具分类
         *          角色属性（树木、免费刷新、+敌人，+敌人速度，道具价格，捡材料概率回血，燃烧速度）
         *          生成（炮塔、生成花园、地雷、小型机器人）
         *          脚本（结束时提高%收获，结束时+%伤害，抵消第一次攻击，站立不动+属性，拥有%速度提升%伤害，每5秒+%伤害）
         *      选角色后，平衡角色属性 CharacterPropManager._buffProp
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
            "Prefabs/Prepare",
            "Prefabs/StartMenu",
            "Prefabs/GamePlayUI",
            "Prefabs/Countdown",
            "Prefabs/Compass",
            "Prefabs/LevelUp",
            "Prefabs/ItemsUI",
            "Prefabs/ChestCheckoutUI"
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
