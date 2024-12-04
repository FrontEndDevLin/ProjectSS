import { _decorator, Component, Node, Prefab, Vec3, tween } from 'cc';
import OO_UIManager from '../../OO/Manager/OO_UIManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
import { BulletAttr } from '../Interface';
import { BulletCtrl } from '../GameControllers/bullet/BulletCtrl';
import { DBManager } from './DBManager';
import WeaponManager from './WeaponManager';
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
    { id: "BT001", prefab: "BT001", speed: 40, max_dis: 10 }
];

let bulletDb: any = null;

const bulletScriptMap = {
}

/**
 * 这个类要初始化一个弹头列表（来自弹头db），存储角色身上武器所携带的弹头数据，角色面板发生变化时，更新该列表的数据
 */
@ccclass('BulletManager')
export class BulletManager extends OO_UIManager {
    static instance: BulletManager = null;
    public abName: string = "GP";

    // 存储当前装备的武器的弹头数据
    private _bulletCldMap = {};

    start() {

    }

    protected onLoad(): void {
        if (!BulletManager.instance) {
            BulletManager.instance = this;
        } else {
            this.destroy();
            return;
        }
        // 初始化各种子弹预设体
        OO_ResourceManager.instance.preloadResPkg([{ abName: this.abName, assetType: Prefab, urls: [`Prefabs/bullet/BT001`] }], () => {}, err => {
            console.log('所有子弹预设体加载完毕')
        });

        bulletDb = DBManager.instance.getDbData("Bullet");
    }

    public updateBulletList() {
        let weaponList: any[] = WeaponManager.instance.weaponList;
        // 根据该列表，生成新的列表格式为 { 弹头Tag: { 弹头数据 } }，弹头数据需要结合角色面板进行计算
        for (let data of weaponList) {
            let bulletId = data.bullet;
            let bData = bulletDb[bulletId];
            // TODO: 临时设置，伤害需要经过DamageManager类面板计算后
            bData.damage = 5;
            this._bulletCldMap[bData.cld] = bData;
        }
    }

    public createBullet(bulletId: string, position: Vec3, vector: Vec3) {
        // console.log(`创建子弹${bulletId}`)
        const bulletAttr = bulletDb[bulletId];
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

