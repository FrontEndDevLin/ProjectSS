import { _decorator, Component, find, Node, Prefab, UIOpacity, Vec2, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { Callback, CharacterAttribute, WeaponAttribute, WeaponData } from '../Interface';
import WeaponManager from './WeaponManager';
import { DBManager } from './DBManager';
import { BulletManager } from './BulletManager';
const { ccclass, property } = _decorator;

// 角色管理类，管理角色属性、武器等
export default class CharacterManager extends OO_UIManager {
    static instance: CharacterManager = null;

    public abName: string = "GP";

    public characterId: string = "";

    public attribute: any = null;
    public defPanel: any = null;

    private _characterLoc: Vec3 = null;
    private _shellNode: Node = null;

    protected onLoad(): void {
        if (!CharacterManager.instance) {
            CharacterManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        console.log("Character Manager loaded")

        /**
         * 角色套个外壳，是为了让其他组件更好查找角色节点，因为外壳节点名称固定
         */
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/character/Character`] }], () => {}, err => {
            console.log('角色预设体外壳加载完毕')
        })
    }

    // 这个方法只调用一次
    public initCharacter(characterId: string, callback?: Callback) {
        this.characterId = characterId;

        let characterDb = DBManager.instance.getDbData("Character");
        this.attribute = characterDb[characterId];
        console.log(`角色初始面板`);
        console.log(this.attribute)
        this.defPanel = characterDb["def_panel"];

        WeaponManager.instance.initWeapon(['test']);
        BulletManager.instance.updateBulletList();

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/character/${characterId}`] }], () => {}, err => {
            if (callback) {
                callback(err)
            }
        });
    }

    public showCharacter() {
        this._shellNode = this.showUI("character/Character", this.rootNode, "CharacterCtrl");
        this.showUI(`character/${this.characterId}`, this._shellNode);

        WeaponManager.instance.showWeapon();
        WeaponManager.instance.updateWeaponPanel();
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
    public getCharacterPanel() {
        return this.attribute.panel;
    }

    start() {

    }
}


