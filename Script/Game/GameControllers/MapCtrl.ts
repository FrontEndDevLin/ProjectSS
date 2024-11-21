import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import { OO_Component } from '../../OO/OO';
import MapManager from '../CManager/MapManager';
import OO_ResourceManager from '../../OO/Manager/OO_ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('MapCtrl')
export class MapCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
        console.log('Map ctrl loaded')
    }

    start() {
        // 地图应该由MapCtrl控制
        this.views["SF"].getComponent(Sprite).spriteFrame = MapManager.instance.mapAsset;
    }

    update(deltaTime: number) {
        
    }
}

