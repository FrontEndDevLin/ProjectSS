import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_GAME } from '../CEvent';
import { StoreManager } from '../CManager/StoreManager';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { BProp } from '../Interface';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
import { LevCardCtrl } from './prepare/LevCardCtrl';
import { LevelManager } from '../CManager/LevelManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.updLevCnt 升级次数
 */
@ccclass('LevelUpCtrl')
export class LevelUpCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log("LevelUpCtrl loaded");

        this.views["Bottom/Attr"].on(Node.EventType.TOUCH_END, () => {
            ChapterManager.instance.hideLevelUpUI();
            CharacterPropManager.instance.showCHTPropUI();
        }, this);

        let levUpCnt: number = LevelManager.instance.getLevelUpCnt();
        if (levUpCnt > 0) {
            this.views["Wrap/ItemList"].children.forEach((slotNode: Node, i) => {
                const uiNode: Node = this.loadUINode("common/LevCard", "LevCardCtrl");
                slotNode.addChild(uiNode);
                slotNode.on(Node.EventType.TOUCH_END, () => { this._levelUp(i) }, this);
            });

            this._initStore();
        }
    }

    start() {

    }

    private _initStore() {
        StoreManager.instance.initLevUpd();
        this._updateView();
    }

    private _updateView() {
        this.views["Wrap/ItemList"].children.forEach((slotNode: Node, i) => {
            this._renderLevUpdNode(slotNode, i);
        });
    }

    private _renderLevUpdNode(slotNode: Node, idx: number) {
        // console.log(idx);
        let levCardNode: Node = slotNode.children[0];
        levCardNode.OO_param1 = {
            idx
        };
        let cardNodeCtx: LevCardCtrl = levCardNode.getComponent("LevCardCtrl") as LevCardCtrl;
        cardNodeCtx.updateCard();
    }

    private _levelUp(idx: number) {
        // TODO: 点击后，给角色某个属性升级
        // 判断updLevCnt次数，决定是销毁当前节点还是继续升级流程
        CharacterPropManager.instance.levelUpProp(StoreManager.instance.currentLevUpd[idx]);
        LevelManager.instance.finishOnceTimeLevelUp();

        if (LevelManager.instance.getLevelUpCnt() > 0) {
            StoreManager.instance.refreshLevUpd(true);
            this.updateView();
        } else {
            console.log('关闭升级界面，进入商店');
            ChapterManager.instance.closeLevelUpUI();
        }
    }

    update(deltaTime: number) {
        
    }
}

