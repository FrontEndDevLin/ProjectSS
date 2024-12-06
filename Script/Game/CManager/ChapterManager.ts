import { _decorator, Component, Node } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

/**
 * 关卡管理类，游戏流程控制
 * 由该类来控制当前关卡状态(准备阶段、进行中)
 * 和UI的切换，(游戏ui -> 商店ui)
 */
@ccclass('ChapterManager')
export class ChapterManager extends OO_UIManager {
    static instance: ChapterManager = null;

    private _chapter: number = 1;
    public countdown: number = 0;

    protected onLoad(): void {
        if (!ChapterManager.instance) {
            ChapterManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log('Chapter Manager loaded')
    }

    public nextChapter() {
        this._chapter++;
        this._enterChapter();
    }
    // 进入当前关卡
    private _enterChapter() {
        
    }
    // 结束当前关卡
    private _endChapter() {
        // 所有敌人阵亡(不爆东西)

        // 判断是否捡到宝箱，有则弹出开箱界面

        // 判断是否有升级，有则弹出升级界面

        // 进入商店界面
    }

    update(deltaTime: number) {
        
    }
}


