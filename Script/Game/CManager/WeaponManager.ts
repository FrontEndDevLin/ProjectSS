import { _decorator, Component, find, Label, Node, Prefab, SpriteFrame, v3, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { Callback, WeaponData, WeaponSlotInfo } from '../Interface';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { WeaponCtrl } from '../GameControllers/weapon/WeaponCtrl';
import { DBManager } from './DBManager';
import CharacterManager from './CharacterManager';
import { DamageManager } from './DamageManager';
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
    }

    start() {

    }

    private _preload() {
        this._preloadWeaponIcon();

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: ["Prefabs/weapon/WeaponShell"] }], () => {}, err => {
            console.log('武器预设体外壳加载完毕')
        })

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: ["Prefabs/weapon/Weapon001"] }], () => {}, err => {
            console.log('武器预设体加载完毕')
        })

        OO_ResourceManager.instance.preloadResPkg([{ abName: "GUI", assetType: Prefab, urls: [
            "Prefabs/PreviewWp"
        ] }], (total, current) => {
        }, (err, data: any) => {
        })
    }
    // 预加载所有图标
    private _preloadWeaponIcon() {
        // const iconUrls: string[] = [];
        // for (let WeaponDB of weaponDataList) {
        //     iconUrls.push(`Meterials/weapon/icon/${WeaponDB.icon}`);
        // }
        // return console.log(`preload weapon icon: ${iconUrls.join(',')}`);
        // OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: SpriteFrame, urls: iconUrls }], () => {}, err => {
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
        for (let i = 0; i < 2; i++) {
            this.addWeapon(weaponIds[i])
        }
        console.log('武器初始面板')
    }
    // 能否购买武器，除了判断武器槽位外可能还需要做其他判断(合成武器)
    public isCanByWeapon(): boolean {
        return this.weaponList.length < this.slot;
    }
    // 购买武器调用
    public addWeapon(weaponId: string): boolean {
        if (this.weaponList.length < this.slot) {
            // 临时处理
            this.weaponList.push(WeaponDB["Weapon001"]);
            return true;
        } else {
            return false;
        }
    }
    // 更新武器数据，根据角色面板、道具
    public updateWeaponPanel() {
        // let panel = CharacterManager.instance.getCharacterProp();
        for (let weaponId in WeaponDB) {
            let weaponAttr = WeaponDB[weaponId];
            let originPanel = weaponAttr.panel;
            weaponAttr.r_panel = { ...originPanel };
            // 伤害修正
            weaponAttr.r_panel.dmg = DamageManager.instance.calcBulletDamage(weaponAttr.bullet);
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
            let scriptName = item.script || "WeaponCtrl";
            let weaponNode: Node = this.loadUINode("weapon/Weapon001", scriptName);
            weaponNode.setPosition(weaponLocMap[i]);
            const scriptComp: WeaponCtrl = this.appendUINode(weaponNode, WeaponSheel).getComponent(scriptName) as WeaponCtrl;
            scriptComp.initAttr(this.getWeaponDataByWeaponId("Weapon001"));
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

    update(deltaTime: number) {
        
    }
}

