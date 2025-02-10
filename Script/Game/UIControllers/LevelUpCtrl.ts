import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { EventBus } from '../../OO/Manager/OO_MsgManager';
import { CEVENT_GAME } from '../CEvent';
const { ccclass, property } = _decorator;

@ccclass('LevelUpCtrl')
export class LevelUpCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log("LevelUpCtrl loaded");

        this._updateView();
    }

    start() {

    }

    private _updateView() {
        this.views["Wrap/ItemList"].children.forEach((slotNode: Node, i) => {
            slotNode.removeAllChildren();
            // TODO: 临时，CHTCard是给角色选择用的
            /**
             * 属性刷新归StoreManager管理，这里需要从StoreManager拿数据
             */
            const uiNode: Node = this.loadUINode("common/CHTCard");

            slotNode.addChild(uiNode);
            slotNode.on(Node.EventType.TOUCH_END, this._levelUp, this);
        });
    }

    private _levelUp() {
        // console.log(35)
    }

    update(deltaTime: number) {
        
    }
}


