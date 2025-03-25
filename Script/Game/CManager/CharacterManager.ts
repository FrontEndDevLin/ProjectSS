import { _decorator, Component, find, Node, Prefab, UIOpacity, Vec2, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { Callback, WeaponAttribute, WeaponData } from '../Interface';
import WeaponManager from './WeaponManager';
import { DBManager } from './DBManager';
import { BulletManager } from './BulletManager';
import { LevelManager } from './LevelManager';
import { OO_AddManager } from '../../OO/OO_Manager';
import { CurrencyManager } from './CurrencyManager';
import { CharacterPropManager } from './CharacterPropManager';
const { ccclass, property } = _decorator;

let CharacterDB: any = null;

// 角色管理类，管理角色属性、武器等
export default class CharacterManager extends OO_UIManager {
    static instance: CharacterManager = null;

    public abName: string = "GP";

    public characterId: string = "";

    private _characterLoc: Vec3 = null;
    private _shellNode: Node = null;

    protected onLoad(): void {
        if (!CharacterManager.instance) {
            CharacterManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        CharacterDB = DBManager.instance.getDbData("Character");
        console.log("Character Manager loaded")

        /**
         * 角色套个外壳，是为了让其他组件更好查找角色节点，因为外壳节点名称固定
         */
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/character/Character`] }], () => {}, err => {
            console.log('角色预设体外壳加载完毕')
        });

        OO_AddManager(LevelManager);
        OO_AddManager(CurrencyManager);
        LevelManager.instance.initLevel();
    }

    // 这个方法只调用一次
    public initCharacter(characterId: string, callback?: Callback) {
        this.characterId = characterId;

        CharacterPropManager.instance.initProp(characterId);
        // TODO: 武器面板放这里不妥
        WeaponManager.instance.updateWeaponPanel();

        WeaponManager.instance.initWeapon(['Weapon101-gun']);
        BulletManager.instance.updateBulletList();

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/character/${characterId}`] }], () => {}, err => {
            if (callback) {
                callback(err)
            }
        });
    }

    public getSimpleList(): any[] {
        if (!CharacterDB) {
            console.error("CharacterDB not loaded!");
            return;
        }
        let list: any[] = [];
        for (let cId in CharacterDB) {
            if (cId.includes("CR")) {
                let item = CharacterDB[cId];
                list.push({
                    key: item.key,
                    label: item.label,
                    pic: item.pic,
                    buff: item.buff
                })
            }
        }
        return list;
    }

    public addCharacter() {
        if (!this.characterId) {
            return console.error(`character ${this.characterId} not loaded`);
        }
        this._shellNode = this.showUI("character/Character", this.rootNode, "CharacterCtrl");
        this.showUI(`character/${this.characterId}`, this._shellNode);
    }
    public showWeapon() {
        WeaponManager.instance.showWeapon();
    }
    public removeCharacter() {
        this.removeUI("Character", this.rootNode);
    }
    public setCharacterLoc(loc: Vec3): void {
        this._characterLoc = loc;
    }
    public getCharacterLoc(): Vec3 {
        return this._characterLoc;
    }

    // 获取角色面板
    // public getCharacterProp() {
    // }

    start() {

    }
}


