import { _decorator, Component, Label, Node, UITransform, v3, Widget } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { CountdownCtrl } from '../UIControllers/CountdownCtrl';
import { DBManager } from './DBManager';
import MapManager from './MapManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_CHARACTER, CEVENT_GAME } from '../CEvent';
import CharacterManager from './CharacterManager';
import { EnemyManager } from './EnemyManager';
import { COUNTDOWN_EVENT, CountdownManager } from './CountdownManager';
import WeaponManager from './WeaponManager';
import { DropItemManager } from './DropItemManager';
import { LevelManager } from './LevelManager';
const { ccclass, property } = _decorator;

/**
 * 关卡管理类，游戏流程控制
 * 由该类来控制当前关卡状态(准备阶段、进行中)
 * 和UI的切换，(游戏ui -> 商店ui)
 */
let ChapterDB: any = null;

@ccclass('ChapterManager')
export class ChapterManager extends OO_UIManager {
    static instance: ChapterManager = null;

    public onPlaying: boolean = false;

    private _chapter: number = 1;

    protected onLoad(): void {
        if (!ChapterManager.instance) {
            ChapterManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log('Chapter Manager loaded');

        ChapterDB = DBManager.instance.getDbData("Chapter");
    }

    // TODO: 名字乱起的
    public _initGameItems() {
        MapManager.instance.initMap();
        MapManager.instance.showMap();
        CountdownManager.instance.showCountdown();
        EnemyManager.instance.startListen();
        this.showUI("GamePlayUI");
        CountdownManager.instance.on(COUNTDOWN_EVENT.TIME_OVER, this._endChapter, this);

        this._preplayChapter(1);
    }

    // 进入角色选择界面，当前不做
    // 地图、角色、状态ui等在选角时就挂载，关卡结束时不卸载，用其他界面覆盖即可
    public showCharacterSelect() {
        this.showUI("CharacterSelect");
    }

    // 角色选择完成。TODO: 下一步该选难度/武器
    public chtSelectComplete(chrId: string) {
        OO_UIManager.instance.removeUI("CharacterSelect");
        this._initGameItems();
        // initCharacter方法，在选择完角色后，进入选择难度界面时调用，目前直接调用
        CharacterManager.instance.initCharacter(chrId, err => {
            if (err) {
                return;
            }
            LevelManager.instance.on(CEVENT_CHARACTER.EXP_CHANGE, (err, data: any) => {
                let expCurrent: number = data.expCurrent;
                let expTotal: number = data.expTotal;
                
            });
            // 进入地图，
            // 加载控制器
            this.showUI("Compass");
            // TODO: 这个方法在正式进入游戏时才调用
            this.intoChapter();
        })
    }

    public getCurrentChapter(): number {
        return this._chapter;
    }
    public getChapterData() {
        return ChapterDB[this._chapter];
    }
    public intoChapter() {
        this._enterChapter();
    }
    public nextChapter() {
        this._chapter++;
        this._enterChapter();
    }
    // 预载下一关的数据，在游戏开始前的选角、游戏中途的商店界面触发
    // 地图、角色、状态ui等在选角时就挂载，关卡结束时不卸载，用其他界面覆盖即可
    private _preplayChapter(chapter?: number) {
        if (!chapter) {
            chapter = this._chapter + 1;
        }
        console.log(`预载第${chapter}波数据`);
        let chapterData = ChapterDB[chapter];
        if (!chapterData) {
            return;
        }
        CountdownManager.instance.preplay(chapterData.seconds);
        EnemyManager.instance.setRoles(chapterData);
        DropItemManager.instance.updateChapterRateData();
    }
    // 进入当前关卡
    private _enterChapter() {
        EventBus.emit(CEVENT_GAME.START);
        OO_UIManager.instance.removeUI("Prepare");
        // 显示角色
        CharacterManager.instance.addCharacter();
        CharacterManager.instance.setCharacterLoc(v3(0, 0, 0));
        CharacterManager.instance.showWeapon();
        CountdownManager.instance.startCountdown();
        this.onPlaying = true;
        console.log(`进入第${this._chapter}关`);
        // 载入刷怪规则、显示地图、角色、UI、开始计时
    }
    // 结束当前关卡
    private _endChapter() {
        /**
         * 关卡结束通知（回收材料、升级界面、商店界面）
         */
        EventBus.emit(CEVENT_GAME.PASS);
        this.onPlaying = false;
        // this.removeUI("Compass");
        // this.removeUI("GamePlayUI");
        // 所有敌人阵亡(不爆东西)
        EnemyManager.instance.removeAllEnemy();

        DropItemManager.instance.resRecovery();

        this.scheduleOnce(() => {
            CharacterManager.instance.removeCharacter();
            // TODO: 判断是否捡到宝箱，有则弹出开箱界面
    
            // TODO: 判断是否有升级，有则弹出升级界面 LevelManager
            /**
             * 进入商店界面
             *  可看到自己的武器，道具，面板，商店界面
             */
            let updLevCnt: number = LevelManager.instance.getUpdLelCnt();
            if (updLevCnt > 0) {
                let levelUpUINode: Node = OO_UIManager.instance.loadUINode("LevelUp");
                levelUpUINode.OO_param1 = { updLevCnt };
                OO_UIManager.instance.appendUINode(levelUpUINode);
            }
    
            // OO_UIManager.instance.showUI("Prepare");
            // this._preplayChapter();
        }, 3);
    }

    protected onDestroy(): void {
        CountdownManager.instance.off(COUNTDOWN_EVENT.TIME_OVER, this._endChapter, this);
    }

    update(deltaTime: number) {
    }
}


