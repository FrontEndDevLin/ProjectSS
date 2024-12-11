import { _decorator, Component, Label, Node, UITransform, Widget } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { CountdownCtrl } from '../UIControllers/CountdownCtrl';
import { DBManager } from './DBManager';
import MapManager from './MapManager';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_COUNTDOWN, CEVENT_GAME, CEVENT_PREPLAY } from '../CEvent';
import CharacterManager from './CharacterManager';
import { EnemyManager } from './EnemyManager';
const { ccclass, property } = _decorator;

/**
 * 关卡管理类，游戏流程控制
 * 由该类来控制当前关卡状态(准备阶段、进行中)
 * 和UI的切换，(游戏ui -> 商店ui)
 */
let ChapterDB: any = null;

@ccclass('ChapterManager')
export class ChapterManager extends OO_UIManager {
    public onPlaying: boolean = false;

    static instance: ChapterManager = null;

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

        EventBus.on(CEVENT_COUNTDOWN.OVER, this._endChapter, this);
    }

    public initGameItems() {
        MapManager.instance.showMap();
        this.showUI("Countdown");
        this.showUI("GamePlayUI");
        this._preplayChapter();
    }

    // 进入角色选择界面，当前不做
    // 地图、角色、状态ui等在选角时就挂载，关卡结束时不卸载，用其他界面覆盖即可
    public characterSelect() {
        MapManager.instance.initMap();
        this.initGameItems();
        CharacterManager.instance.initCharacter("CR001", err => {
            if (err) {
                return;
            }
            // 进入地图，显示角色
            CharacterManager.instance.showCharacter();
            // 加载控制器
            OO_UIManager.instance.showUI("Compass");

            // TODO: 这个方法在正式进入游戏时才调用
            this.intoChapter();
        })
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
    private _preplayChapter() {
        let chapterData = ChapterDB[this._chapter];
        EventBus.emit(CEVENT_PREPLAY.COUNTDOWN, chapterData.seconds);
        EnemyManager.instance.setRoles(chapterData);
    }
    // 进入当前关卡
    private _enterChapter() {
        EventBus.emit(CEVENT_GAME.START);
        this.onPlaying = true;
        console.log(`进入第${this._chapter}关`);
        // 载入刷怪规则、显示地图、角色、UI、开始计时
    }
    // 结束当前关卡
    private _endChapter() {
        /**
         * 关卡结束通知（回收材料、升级界面、商店界面）
         */
        this.onPlaying = false;

        // 所有敌人阵亡(不爆东西)

        // 判断是否捡到宝箱，有则弹出开箱界面

        // 判断是否有升级，有则弹出升级界面

        // 进入商店界面
    }

    protected onDestroy(): void {
        EventBus.off(CEVENT_COUNTDOWN.OVER, this._endChapter, this);
    }

    update(deltaTime: number) {
    }
}


