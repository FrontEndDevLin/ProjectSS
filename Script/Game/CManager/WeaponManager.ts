import { _decorator, Component, find, Label, Node, Prefab, SpriteFrame, v3, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { BProp, Callback, WeaponData, WeaponSlotInfo } from '../Interface';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { WeaponCtrl } from '../GameControllers/weapon/WeaponCtrl';
import { DBManager } from './DBManager';
import CharacterManager from './CharacterManager';
import { DamageManager } from './DamageManager';
import { CharacterPropManager } from './CharacterPropManager';
import { CEVENT_CHARACTER } from '../CEvent';
import { BulletManager } from './BulletManager';
const { ccclass, property } = _decorator;

/**
 * 武器数值需要结合角色属性，道具加成的计算后反馈给weaponDB
 * 当角色属性、道具变化后，立即更新该武器列表，避免视觉延迟
 * 
 * 面板数据可以调用本类的接口获取
 */

let WeaponDB: any = null;

interface WeaponLoc {
    [index: number]: Vec3
}

export default class WeaponManager extends OO_UIManager {
    /**
     * 武器管理类，用于加载武器，管理武器
     */
    static instance: WeaponManager = null;

    public rootNode: Node = null;

    public abName: string = "GP";

    // 武器位
    public slot: number = 6;

    // weaponList, 管理当前武器列表
    public weaponList: any[] = [];

    private _weaponLoc: WeaponLoc[] = [
        [ v3(4, 0) ],
        [ v3(24, 0), v3(-24, 0) ],
        [ v3(22, -4), v3(-22, -4), v3(0, 24) ],
        [ v3(20, 14), v3(20, -14), v3(-20, -14), v3(-20, 14) ],
        [ v3(20, 12), v3(20, -12), v3(-20, -12), v3(-20, 12), v3(0, 24) ],
        [ v3(20, 14), v3(20, 0), v3(20, -14), v3(-20, -14), v3(-20, 0), v3(-20, 14) ]
        // [ v3(20, 14), v3(20, -14), v3(-20, -14), v3(-20, 14) ]
    ]

    protected onLoad(): void {
        if (!WeaponManager.instance) {
            WeaponManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Weapon Manager loaded");

        /**
         * 应将所有武器预加载，避免刷新商店时延迟显示
         * 加载所有武器的图标
         * 预设体可按需加载
         */
        WeaponDB = DBManager.instance.getDbData("Weapon");
        this._preload();

        CharacterPropManager.instance.on(CEVENT_CHARACTER.PROP_CHANGE, () => {
            console.log('属性变化');
            this.updateWeaponPanel();
            BulletManager.instance.updateBulletList();
        })
    }

    start() {

    }

    private _preload() {
        this._preloadWeaponIcon();

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: ["Prefabs/weapon/WeaponShell"] }], () => {}, err => {
            console.log('武器预设体外壳加载完毕')
        })

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [
            "Prefabs/weapon/Weapon001",
            "Prefabs/weapon/WeaponGP"
        ] }], () => {}, err => {
            console.log('武器预设体加载完毕')
        })

        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/PreviewWp"
        ] }], (total, current) => {
        }, (err, data: any) => {
        })

        OO_ResourceManager.instance.preloadResPkg([{
            abName: "GP",
            assetType: SpriteFrame,
            urls: [
                "Materials/weapon/weapon-001-dagger/spriteFrame",
                "Materials/weapon/weapon-101-gun/spriteFrame"
            ]
        }], () => {}, err => {})
    }
    // 预加载所有图标
    private _preloadWeaponIcon() {
        // const iconUrls: string[] = [];
        // for (let WeaponDB of weaponDataList) {
        //     iconUrls.push(`Meterials/weapon/icon/${WeaponDB.icon}`);
        // }
        // return console.log(`preload weapon icon: ${iconUrls.join(',')}`);
        // OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: SpriteFrame, urls: ["Meterials/weapon/icon/weapon-001-dagger"] }], () => {}, err => {
        //     console.log('武器图标加载完毕');
        // })
    }

    private _getRandomWeapon() {
        let keys: string[] = Object.keys(WeaponDB);
        let len = keys.length;
        let randomKey = keys[Math.floor(Math.random() * len)];
        return WeaponDB[randomKey];
    }

    public getWeaponPanelNode(weaponId): Node {
        const weaponItem = this.getWeaponDataByWeaponId(weaponId);
        let ary: any = [];
        if (weaponItem.r_panel.dmg) {
            ary.push({
                label: "伤害",
                value: weaponItem.r_panel.dmg
            });
        }
        if (weaponItem.r_panel.atk_spd) {
            ary.push({
                label: "冷却",
                value: weaponItem.r_panel.atk_spd + "s"
            });
        }
        if (weaponItem.r_panel.range) {
            ary.push({
                label: "范围",
                value: weaponItem.r_panel.range
            });
        }
        let wpPanelNode: Node = this.loadUINode("GUI:common/PanelWrap", "NONE");
        for (let item of ary) {
            let panelNode: Node = this.loadUINode("GUI:common/PanelItem", "NONE");
            panelNode.getChildByName("Label").getComponent(Label).string = `${item.label}: `;
            panelNode.getChildByName("Value").getComponent(Label).string = item.value;
            wpPanelNode.addChild(panelNode);
        }

        return wpPanelNode;
    }

    // 获取随机的n个武器，用于商店刷新
    public getRandomWeapons(n?: number): any[] {
        n = n || 4;
        let res: any = [];
        for (let i = 0; i < n; i++) {
            res.push(this._getRandomWeapon());
        }
        return res;
    }

    // 初始化武器，应在职业选后调用
    public initWeapon(weaponIds: string[]) {
        if (!this.rootNode) {
            // this.rootNode = find("Canvas/")
        }
        for (let i = 0; i < 1; i++) {
            this.addWeapon(weaponIds[i]);
        }
        // console.log('武器初始面板')
    }
    // 能否购买武器，除了判断武器槽位外可能还需要做其他判断(合成武器)
    public isCanByWeapon(): boolean {
        return this.weaponList.length < this.slot;
    }
    // 购买武器调用
    public addWeapon(weaponId: string): boolean {
        if (this.weaponList.length < this.slot) {
            // 临时处理
            this.weaponList.push(WeaponDB[weaponId]);
            return true;
        } else {
            return false;
        }
    }
    // 更新武器数据，根据角色面板、道具
    public updateWeaponPanel() {
        // let panel = CharacterManager.instance.getCharacterProp();
        for (let weaponId in WeaponDB) {
            // 属性修正
            this.amendWeaponPanel(weaponId);
        }
    }

    public removeWeapon() {

    }
    public showWeapon() {
        // 将当前装备的武器列表放进预设体外壳里，并将预设体外壳挂在到character节点下
        const WeaponSheel: Node = this.loadUINode("weapon/WeaponShell");
        const weaponCnt = this.weaponList.length;
        const weaponLocMap = this._weaponLoc[weaponCnt - 1];
        this.weaponList.forEach((item, i) => {
            let scriptName = "";
            if (item.type === "melee") {
                scriptName = "WeaponMelee"
            } else if (item.type === "range") {
                scriptName = "WeaponRange";
            }
            // let scriptName = item.script || "WeaponBase";
            let weaponNode: Node = this.loadUINode("weapon/WeaponGP", scriptName);
            weaponNode.OO_param1 = { weaponId: item.id };
            this.appendUINode(weaponNode, WeaponSheel);
            weaponNode.setPosition(weaponLocMap[i]);
        });

        this.appendUINode(WeaponSheel, find("Canvas/Character"));
    }
    // 通过武器名获取面板
    public getWeaponDataByWeaponId(weaponId: string) {
        /**
         * 面板需要提前计算好，这里只做返回
         */
        return WeaponDB[weaponId];
    }
    // 计算武器伤害，主要用于反馈到面板上
    public getWeaponDamage(weaponId: string) {
        let weaponPanel = this.getWeaponDataByWeaponId(weaponId).r_panel;
        let dmg: number = weaponPanel.dmg;
        return dmg;
    }
    // 通过角色当前属性，获得修正指定武器的面板
    public amendWeaponPanel(weaponId) {
        let weaponData = WeaponDB[weaponId];
        let originPanel = weaponData.panel;
        if (!weaponData.r_panel) {
            weaponData.r_panel = { ...originPanel };
        }

        if (weaponData.type === "melee") {
            let baseDmg: number = weaponData.panel.dmg;
            let dmgProp: BProp = CharacterPropManager.instance.dmg;
            let meleeDmgProp: BProp = CharacterPropManager.instance.melee_dmg;
            let dmgBoost: number = 1 + (dmgProp.value || 0) / 100;

            // (基础伤害 + 近战加成伤害) * 总伤害百分比
            weaponData.r_panel.dmg = Math.round((baseDmg + meleeDmgProp.value * weaponData.melee_dmg_boost / 100) * dmgBoost);
            // TODO: 其他位置可能没有使用r_panel，而是错误使用了panel
            // TODO: 还有其他属性要修正，如攻速、穿透等...
        }
    }

    update(deltaTime: number) {
        
    }
}

