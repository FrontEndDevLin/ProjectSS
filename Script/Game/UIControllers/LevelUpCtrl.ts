import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_GAME } from '../CEvent';
import { StoreManager } from '../CManager/StoreManager';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ChapterManager } from '../CManager/ChapterManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.updLevCnt 升级次数
 */
@ccclass('LevelUpCtrl')
export class LevelUpCtrl extends OO_Component {
    // 当前升级次数
    private _currentTime: number = 0;

    protected onLoad(): void {
        super.onLoad();

        console.log("LevelUpCtrl loaded");

        let updLevCnt: number = this.node.OO_param1.updLevCnt;
        if (updLevCnt > 0) {
            this._currentTime = 1;
            this._initStore();
        }

        this.views["Wrap/ItemList"].children.forEach((slotNode: Node, i) => {
            slotNode.on(Node.EventType.TOUCH_END, () => { this._levelUp(i) }, this);
        });
    }

    start() {

    }

    private _initStore() {
        StoreManager.instance.initLevUpd();
        this._updateView();
    }

    private _updateView() {
        this.views["Wrap/ItemList"].children.forEach((slotNode: Node, i) => {
            slotNode.removeAllChildren();
            /**
             * 属性刷新归StoreManager管理，这里需要从StoreManager拿数据
             */
            let item: any = StoreManager.instance.currentLevUpd[i];

            if (item) {
                const uiNode: Node = this.loadUINode("common/LevCard", "NONE");
                slotNode.addChild(uiNode);
            }
        });
    }

    private _levelUp(idx: number) {
        // TODO: 点击后，给角色某个属性升级
        // 判断updLevCnt次数，决定是销毁当前节点还是继续升级流程
        console.log(StoreManager.instance.currentLevUpd[idx])

        if (this._currentTime < this.node.OO_param1.updLevCnt) {
            this._currentTime++;
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

