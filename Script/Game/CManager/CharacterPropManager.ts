import { _decorator, Component, Node, Prefab, UITransform, v3 } from 'cc';
import { BProp, CHTBaseProp, CHTCommonProp } from '../Interface';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { DBManager } from './DBManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('CharacterPropManager')
export class CharacterPropManager extends OO_UIManager {
    private _CHTPropUINode: Node = null;

    static instance: CharacterPropManager;

    public baseProp: CHTBaseProp = null;

    public hp: BProp = createBProp({ key: "hp", label: "最大生命" });
    public hp_cur: BProp = createBProp({ key: "hp_cur", label: "当前生命" });
    public hp_floor: BProp = createBProp({ key: "hp_floor", label: "生命下限" });
    public spd: BProp = createBProp({ key: "spd", label: "速度" });
    public range: BProp = createBProp({ key: "range", label: "范围" });
    public atk_spd: BProp = createBProp({ key: "atk_spd", label: "攻击速度" });
    public dmg: BProp = createBProp({ key: "dmg", label: "伤害" });
    public range_dmg: BProp = createBProp({ key: "range_dmg", label: "远程伤害" });
    public melee_dmg: BProp = createBProp({ key: "melee_dmg", label: "近战伤害" });
    public def: BProp = createBProp({ key: "def", label: "防御" });
    public avd: BProp = createBProp({ key: "avd", label: "闪避" });
    public avd_ceil: BProp = createBProp({ key: "avd_ceil", label: "闪避上限" });

    public pick_range: BProp = createBProp({ key: "pick_range", label: "拾取范围" });
    public exp_eff: BProp = createBProp({ key: "exp_eff", label: "经验加成" });

    public propKeys: string[] = [
        "hp", "spd", "range", "atk_spd", "dmg",
        "range_dmg", "melee_dmg", "def", "avd",
        "avd_ceil", "pick_range", "exp_eff"
    ];
    public majorKeys: string[] = ["hp", "spd", "range", "atk_spd", "dmg", "range_dmg", "melee_dmg", "def", "avd"];
    public minorKeys: string[] = ["pick_range", "exp_eff"];

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
        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/CHTPropUI",
            "Prefabs/prepare/CHTPropCard",
            "Prefabs/common/CHTPropItem"
        ] }], (total, current) => {
        }, (err, data: any) => {
            if (err) {
                console.log(err);
                return;
            }
        });
    }

    public getPropList(group?: string): BProp[] {
        let tar = "propKeys";
        if (group === "major") {
            tar = "majorKeys";
        } else if (group === "minor") {
            tar = "minorKeys";
        }
        let keys: string[] = this[tar];
        let list: BProp[] = [];
        for (let key of keys) {
            let propItem: BProp = this[key];
            list.push(propItem);
        }
        return list;
    }

    // 商店界面，角色属性UI
    public loadCHTPropUI() {
        this._CHTPropUINode = OO_UIManager.instance.showUI("CHTPropUI");
    }
    public showCHTPropUI() {
        this._CHTPropUINode.setPosition(0, 0);
    }
    public hideCHTPropUI() {
        this._CHTPropUINode.setPosition(1000, 0);
    }
    public removeCHTPropUI() {
        OO_UIManager.instance.removeUI("CHTPropUI");
        this._CHTPropUINode = null;
    }
    public initProp(characterId: string) {
        this._initCommonProp();
        this._buffProp(characterId);
    }
    public recoverHP() {
        this.hp_cur.value = this.hp.value;
    }
    // 升级提升属性接口
    public levelUpProp(upProp: BProp) {
        let prop: BProp = this[upProp.key];
        prop.value += upProp.value;
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

export const createBProp = function ({ key, label, value, group, buffPos = true }: BProp): BProp {
    return { key, label, group, value, buffPos }
}
