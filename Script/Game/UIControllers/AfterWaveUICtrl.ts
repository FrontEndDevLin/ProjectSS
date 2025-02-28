import { _decorator, Component, Node, v3 } from 'cc';
import { OO_Component } from '../../OO/OO';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { ItemsManager } from '../CManager/ItemsManager';
import { LevelManager } from '../CManager/LevelManager';
import { ChapterManager } from '../CManager/ChapterManager';
import { CharacterPropManager } from '../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

@ccclass('AfterWaveUICtrl')
export class AfterWaveUICtrl extends OO_Component {
    private _chestCheckoutUINode: Node = null;
    private _levelUpUINode: Node = null;

    protected onLoad(): void {
        super.onLoad();
        
        if (ItemsManager.instance.hasChest()) {
            this._chestCheckoutUINode = this.loadUINode("afterWave/ChestCheckoutUI", "ChestCheckoutUICtrl");
            this.node.insertChild(this._chestCheckoutUINode, 0);
            this._showUINode("chest");
        }
        if (LevelManager.instance.getLevelUpCnt() > 0) {
            this._levelUpUINode = this.loadUINode("afterWave/LevelUp", "LevelUpCtrl");
            this.node.insertChild(this._levelUpUINode, 0);
            if (!ItemsManager.instance.hasChest()) {
                this._showUINode("levelUp");
            }
        }

        this.views["Bottom/Attr"].on(Node.EventType.TOUCH_END, () => {
            ChapterManager.instance.hideAfterWaveUI();
            CharacterPropManager.instance.showCHTPropUI();
        }, this);
    }

    private _showUINode(flag: string) {
        let targetNode: Node = null;
        if (flag === "chest") {
            if (!this._chestCheckoutUINode) {
                return;
            }
            targetNode = this._chestCheckoutUINode;
        } else if (flag === "levelUp") {
            if (!this._levelUpUINode) {
                return;
            }
            targetNode = this._levelUpUINode;
        }
        if (targetNode) {
            targetNode.setPosition(v3(0, 0, 0));
        }
    }
    private _hideUINode(flag: string) {
        let targetNode: Node = null;
        if (flag === "chest") {
            if (!this._chestCheckoutUINode) {
                return;
            }
            targetNode = this._chestCheckoutUINode;
        } else if (flag === "levelUp") {
            if (!this._levelUpUINode) {
                return;
            }
            targetNode = this._levelUpUINode;
        }
        if (targetNode) {
            targetNode.setPosition(v3(1000, 0, 0));
        }
    }

    public closeChestCheckoutUI() {
        if (LevelManager.instance.getLevelUpCnt() > 0) {
            // 进入升级界面
            this._hideUINode("chest");
            this._showUINode("levelUp");
        } else {
            // 直接关闭本界面，进入下一流程
            ChapterManager.instance.exitAfterWaveProc();
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


