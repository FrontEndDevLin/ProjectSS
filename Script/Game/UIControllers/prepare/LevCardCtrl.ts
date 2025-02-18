import { _decorator, Component, Label, Node, RichText } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { BProp } from '../../Interface';
import { StoreManager } from '../../CManager/StoreManager';
import { CharacterPropManager } from '../../CManager/CharacterPropManager';
const { ccclass, property } = _decorator;

/**
 * OO_param1.idx 商店的currentLevUpd数组索引
 */

@ccclass('LevCardCtrl')
export class LevCardCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    start() {

    }

    public updateCard() {
        let idx: number = this.node.OO_param1.idx;
        let updProp: BProp = StoreManager.instance.currentLevUpd[idx];
        let prop: BProp = CharacterPropManager.instance[updProp.key];
        this.views["Card/ImgTxt/WName/Name"].getComponent(Label).string = prop.label;
        this.views["Card/Content"].getComponent(RichText).string = `<color=#67C23A>+${updProp.value}</color>${prop.label}`;
    }

    update(deltaTime: number) {
        
    }
}


