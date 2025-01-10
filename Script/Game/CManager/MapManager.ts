import { _decorator, Component, Node, Prefab, Sprite, SpriteFrame, Texture2D, find, instantiate } from 'cc';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import { Callback } from '../Interface';
const { ccclass, property } = _decorator;

export default class MapManager extends OO_UIManager {
    static instance: MapManager = null;
    public abName: string = "Map";

    public mapName: string = "";
    public mapAsset: SpriteFrame = null;
    private _mapList: string[] = ["map01", "map01"];

    protected onLoad(): void {
        if (!MapManager.instance) {
            MapManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        this.rootNode = find("Canvas");

        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: ["Prefabs/Map"] }], () => {}, err => {
        })
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: SpriteFrame, urls: [`Materials/map01/spriteFrame`] }], () => {}, err => {
        })
    }

    public initMap(): void {
        let idx = Math.floor(Math.random() * this._mapList.length);
        this.mapName = this._mapList[idx];
        this.mapAsset = OO_ResourceManager.instance.getAssets(this.abName, `Materials/${this.mapName}/spriteFrame`) as SpriteFrame;
    }
    public showMap(): void {
        this.showUI("Map");
    }
    public hideMap(): void {
        return this.removeUI("Map")
    }
}
