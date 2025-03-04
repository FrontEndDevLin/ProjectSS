import { EventBus } from "../OO/Manager/OO_MsgManager";
import { CEVENT_GAME } from "./CEvent";
import { CharacterPropManager } from "./CManager/CharacterPropManager";
import { ItemsManager } from "./CManager/ItemsManager";
import { COLOR } from "./Common";

// 事件类型的buff
class EventTypeBuff {
  public EVENT;

  public getBuffTxt(): string {
    return "";
  }

  public addListener() {}
}

class Item5 extends EventTypeBuff {
  public EVENT: number = CEVENT_GAME.PASS;

  private _dmg: number = 3;
  private _itemsCnt: number = 1;

  public getBuffTxt(): string {
    return `敌袭结束时<color=${COLOR.SUCCESS}>+${this._dmg}</color>${CharacterPropManager.instance.dmg.label}`;
  }

  public addListener(): void {
    let itemsIdx: any = ItemsManager.instance.itemsListIdx["item5"];
    let itemsCnt: number = ItemsManager.instance.itemsList[itemsIdx].cnt;
    this._itemsCnt = itemsCnt;
    if (itemsCnt === 1) {
      EventBus.on(this.EVENT, this._addDmg, this);
    }
  }

  private _addDmg() {
    CharacterPropManager.instance.updateProp([
      {
        prop: "dmg",
        value: this._dmg * this._itemsCnt
      }
    ])
  }
}

const map = {
  item5: new Item5()
}

export const getScriptTypeItems = (itemName: string): EventTypeBuff => {
  return map[itemName]
}
