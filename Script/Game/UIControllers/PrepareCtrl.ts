import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import { ChapterManager } from '../CManager/ChapterManager';
const { ccclass, property } = _decorator;

@ccclass('PrepareCtrl')
export class PrepareCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        console.log('PrepareCtrl loaded')

        this.views["Store"].addComponent("StoreCtrl");
        this.views["Weapon"].addComponent("PrepareWeaponCtrl");

        let nextWave: number = ChapterManager.instance.getCurrentChapter() + 1;
        this.views["Bottom/GO/Txt"].getComponent(Label).string = `出发（第${nextWave}波）`

        this.views["Bottom/GO"].on(Node.EventType.TOUCH_END, this._nextWave, this);
    }

    private _nextWave() {
        console.log(`准备进入下一关`);
    }

    start() {

    }
    protected onDestroy(): void {
        // this.views["Bottom/GO"].off(Node.EventType.TOUCH_END, this._nextWave, this);
    }

    update(deltaTime: number) {
        
    }
}


