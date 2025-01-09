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
        })

        // PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape
    }

    public runGame(): void {
        this.addCustomManager();

        this.preload((err) => {
            if (err) {
                return;
            }
            OO_UIManager.instance.showUI("CharacterSelect");
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
        })
    }

    public startGame(): void {
        OO_UIManager.instance.removeUI("StartMenu");

        ChapterManager.instance.characterSelect();
    }

    protected preload(callback?: Callback): void {
        let pLoadPrefabs: string[] = [
            "Prefabs/CharacterSelect",
            "Prefabs/common/PanelItem",
            "Prefabs/common/PanelWrap",
            "Prefabs/common/CHTCard",
            "Prefabs/Prepare",
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
