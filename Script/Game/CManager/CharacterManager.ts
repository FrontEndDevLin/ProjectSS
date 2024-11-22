import { _decorator, Component, find, Node, Prefab, Vec2, Vec3 } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { Callback, CharacterAttribute, WeaponAttribute, WeaponData } from '../Interface';
import WeaponManager from './WeaponManager';
const { ccclass, property } = _decorator;

// 角色管理类，管理角色属性、武器等
export default class CharacterManager extends OO_UIManager {
    static instance: CharacterManager = null;

    public abName: string = "GP";

    public character: string = "";

    private _characterLoc: Vec3 = null;

    public attribute: CharacterAttribute = {
        speed: 5
    }

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

    public initCharacter(character: string, callback?: Callback) {
        this.character = character;

        WeaponManager.instance.initWeapon(['test']);

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/character/${this.character}`] }], () => {}, err => {
            if (callback) {
                callback(err)
            }
        })
    }

    public showCharacter() {
        let characterShell: Node = this.showUI("character/Character", this.rootNode, "CharacterCtrl");
        this.showUI(`character/${this.character}`, characterShell);

        WeaponManager.instance.showWeapon();
    }
    public setCharacterLoc(loc: Vec3): void {
        this._characterLoc = loc;
    }
    public getCharacterLoc(): Vec3 {
        return this._characterLoc;
    }

    start() {

    }
}


