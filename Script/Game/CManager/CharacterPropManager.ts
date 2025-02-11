import { _decorator, Component, Node } from 'cc';
import { BProp, CHTBaseProp, CHTCommonProp } from '../Interface';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterPropManager')
export class CharacterPropManager extends OO_UIManager {
    static instance: CharacterPropManager;

    public baseProp: CHTBaseProp = null;

    public hp: BProp = { key: "hp", label: "生命" };
    // 这个hp_cur放在CharacterManager里面？
    public hp_cur: BProp = { key: "hp_cur", label: "当前生命" };
    public spd: BProp = { key: "spd", label: "速度" };
    public range: BProp = { key: "range", label: "范围" };
    public atk_spd: BProp = { key: "atk_spd", label: "攻击速度" };
    public dmg: BProp = { key: "dmg", label: "伤害" };
    public range_dmg: BProp = { key: "range_dmg", label: "远程伤害" };
    public melee_dmg: BProp = { key: "melee_dmg", label: "近战伤害" };
    public def: BProp = { key: "def", label: "防御" };
    public avd: BProp = { key: "avd", label: "闪避" };
    public avd_ceil: BProp = { key: "avd_ceil", label: "闪避上限" };

    public pick_range: BProp = { key: "pick_range", label: "拾取范围" };
    public exp_eff: BProp = { key: "exp_eff", label: "经验加成" };

    public propKeys: string[] = [
        "hp", "hp_cur", "spd", "range", "atk_spd", "dmg",
        "range_dmg", "melee_dmg", "def", "avd",
        "avd_ceil", "pick_range", "exp_eff"
    ];
    public majorKeys: string[] = [];

    protected onLoad(): void {
        if (!CharacterPropManager.instance) {
            CharacterPropManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        this.baseProp = DBManager.instance.getDbData("Character").base_prop;
    }

    start() {

    }

    public initProp(characterId: string) {
        this._initCommonProp();
        this._buffProp(characterId);
    }
    private _initCommonProp() {
        let commonProp: CHTCommonProp = DBManager.instance.getDbData("Character").common_prop;
        for (let key in commonProp) {
            if (key.indexOf("desc") != -1) {
                continue;
            }
            this[key].value = commonProp[key];
        }
    }
    private _buffProp(characterId: string) {
        // 根据characterId查找Character.json，找到对应角色buff，修正基础属性
    }

    update(deltaTime: number) {
        
    }
}

export const getCharacterPropValue = function(key: string, percent: boolean = true): number {
    if (!CharacterPropManager.instance) {
        console.error("CharacterPropManager未实例化!");
        return;
    }
    let prop: BProp = CharacterPropManager.instance[key];
    return percent ? prop.value / 100 : prop.value;
}
