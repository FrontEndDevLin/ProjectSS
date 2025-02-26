import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ItemsManager } from '../CManager/ItemsManager';
import { TROPHY_TYPE } from '../CManager/DropItemManager';
import { BItem } from '../Interface';
const { ccclass, property } = _decorator;

@ccclass('ChestCheckoutUICtrl')
export class ChestCheckoutUICtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        this._loadChest();
    }
    
    start() {

    }

    private _loadChest() {
        if (ItemsManager.instance.hasChest()) {
            let chestQuality: number = ItemsManager.instance.popChest();
            switch (chestQuality) {
                case TROPHY_TYPE.CHEST: {
                    let item: BItem = ItemsManager.instance.getRandomItem(chestQuality);
                    console.log(item)
                } break;
                case TROPHY_TYPE.GREAT_CHEST: {

                } break;
            }
        }
    }

    update(deltaTime: number) {
        
    }
}


