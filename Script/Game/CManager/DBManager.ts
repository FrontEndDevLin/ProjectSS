import { _decorator, Component, JsonAsset, Node } from 'cc';
import OO_Manager from '../../OO/OO_Manager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { Callback } from '../Interface';
const { ccclass, property } = _decorator;

@ccclass('DBManager')
export class DBManager extends OO_Manager {
    static instance: DBManager = null;
    public abName: string = "DB";

    private _loadedCallbackList: Callback[] = [];

    protected onLoad(): void {
        if (!DBManager.instance) {
            DBManager.instance = this;
        } else {
            this.destroy();
            return;
        }

        console.log("DB Manager loaded");

        // 初始化数据（武器、子弹、角色等）
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: JsonAsset, urls: [
            "Character", 
            "Weapon", 
            "Bullet"
        ]}], () => {}, err => {
            console.log("所有数据加载完毕")
            if (err) {
                return console.log(err)
            }
            for (let cb of this._loadedCallbackList) {
                cb(err);
            }
            // console.log(OO_ResourceManager.instance.getAssets(this.abName, "Weapon").json);
        })
    }

    public dbLoaded(callback: Callback) {
        this._loadedCallbackList.push(callback)
    }

    start() {

    }

    public getDbData(dbName: string) {
        const assets = OO_ResourceManager.instance.getAssets(this.abName, dbName) as JsonAsset;
        if (assets) {
            return assets.json;
        }
    }

    update(deltaTime: number) {
        
    }
}

