import { _decorator, Component, find, Node, Prefab, Widget } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { CEVENT_CHARACTER, CEVENT_GAME } from '../CEvent';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

/**
 * 等级管理
 */
@ccclass('LevelManager')
export class LevelManager extends OO_UIManager {
    static instance: LevelManager = null;

    private _levelUpIconUINode: Node = null;
    // 本回合升级次数
    private _levelUpCnt: number = 0;
    // 当前角色等级
    public level: number = 0;
    // 升1级所需经验
    public expTotal: number = 0;
    // 当前经验
    public expCurrent: number = 0;

    protected onLoad(): void {
        if (!LevelManager.instance) {
            LevelManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        // EventBus.on(CEVENT_GAME.START, this._saveLevel, this);

        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/common/LevelUpIconWrap",
            "Prefabs/common/LevelUpIcon"
        ] }], (total, current) => {
        }, (err, data: any) => {
        });
    }

    start() {

    }

    // private _saveLevel() {
    //     this._levelUpCnt = 0;
    // }

    private _calcExpTotal() {
        // 等级计算公式(暂定)
        return this.level * 8 + Math.pow((this.level + 1), 2) + 8;
    }
    private _levelUp() {
        this.level++;
        this._levelUpCnt++;
        this._loadLevelUpIcon();
        let overflowExp: number = this.expCurrent - this.expTotal;
        this.expCurrent = 0;
        this.expTotal = this._calcExpTotal();
        this.addExp(overflowExp);
        // 升级后通知各个组件更新
        // TODO: 修改该事件返回值，除了返回当前等级，还需要返回该回合的升级次数
        this.runEventFn(CEVENT_CHARACTER.LEVEL_UP, this.level);
    }

    public initLevel(lev?: number, expCur?: number) {
        this.level = lev || 0;
        this.expTotal = this._calcExpTotal();
        this.expCurrent = expCur || 0;
    }

    public addExp(n: number) {
        // TODO: n要经过经验获取效率的修正
        this.expCurrent += n;
        let c: number = this.expCurrent - this.expTotal;
        if (c >= 0) {
            this._levelUp();
        }

        this.runEventFn(CEVENT_CHARACTER.EXP_CHANGE, { expCurrent: this.expCurrent, expTotal: this.expTotal });
    }

    public getLevelUpCnt() {
        return this._levelUpCnt;
    }
    // 完成一次升级
    public finishOnceTimeLevelUp() {
        this._levelUpCnt--;
        this._loadLevelUpIcon();
    }
    // 右上角升级次数计数
    public showLevelUpIconUI() {
        this._levelUpIconUINode = OO_UIManager.instance.loadUINode("common/LevelUpIconWrap", "NONE");
        OO_UIManager.instance.appendUINode(this._levelUpIconUINode);
        this._levelUpIconUINode.getComponent(Widget).target = find("Canvas");

        this._loadLevelUpIcon();
    }
    public removeLevelUpIconUI() {
        OO_UIManager.instance.removeUI("LevelUpIconWrap");
        this._levelUpIconUINode = null;
    }
    private _loadLevelUpIcon() {
        this._levelUpIconUINode.removeAllChildren();
        for (let i = 0; i < this._levelUpCnt; i++) {
            this.showUI("common/LevelUpIcon", this._levelUpIconUINode, "NONE");
        }
    }

    protected onDestroy(): void {
        // EventBus.off(CEVENT_GAME.START, this._saveLevel, this);
    }

    update(deltaTime: number) {
        
    }
}


