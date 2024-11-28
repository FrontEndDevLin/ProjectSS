import { _decorator, Component, Node, Prefab, Vec3, tween } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { BulletAttr } from '../Interface';
import { BulletCtrl } from '../GameControllers/bullet/BulletCtrl';
import { DBManager } from './DBManager';
const { ccclass, property } = _decorator;

/**
 * 弹头管理类
 * 
 * 传入弹头
 * warhead_type, 
 *  damage, 
 *  type, 飞行类/静止类
 *      -- 只有type=飞行类时生效
 *      vector向量, 
 *      speed,
 *  visiable: 是否可见
 *      -- 只有可见时才生效
 *      pic
 */

const bulletDataList: BulletAttr[] = [
    { id: "BT001", prefab: "BT001", speed: 40, maxDis: 10 }
];

const bulletScriptMap = {
}

@ccclass('BulletManager')
export class BulletManager extends OO_UIManager {
    static instance: BulletManager = null;
    public abName: string = "GP";

    private _bulletPool = [];

    start() {

    }

    protected onLoad(): void {
        if (!BulletManager.instance) {
            BulletManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        // console.log(DBManager.instance.getDbData("Bullet"));
        // 初始化各种子弹预设体
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/bullet/BT001`] }], () => {}, err => {
            console.log('所有子弹预设体加载完毕')
        })
    }

    public createBullet(bulletId: string, position: Vec3, vector: Vec3) {
        // console.log(`创建子弹${bulletId}`)
        const bulletAttr = bulletDataList[0];
        let scriptName = bulletScriptMap[bulletId] || "BulletCtrl";
        const bulletNode: Node = this.loadUINode(`bullet/${bulletAttr.id}`, scriptName);
        bulletNode.setPosition(position);
        // 直接断言脚本是BulletCtrl的实例即可，需要实现initAttr方法
        const scriptComp: BulletCtrl = this.appendUINode(bulletNode).getComponent(scriptName);
        scriptComp.initAttr({ attr: bulletAttr, vector });
    }

    update(deltaTime: number) {
        
    }
}

