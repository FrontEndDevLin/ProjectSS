import { _decorator, Color, Component, EventTouch, Label, Node, Sprite, UITransform } from 'cc';
import { OO_Component } from '../../../OO/OO';
import OO_UIManager from '../../../OO/Manager/OO_UIManager';
import { BProp } from '../../Interface';
import { CharacterPropManager } from '../../CManager/CharacterPropManager';
import { CEVENT_CHARACTER } from '../../CEvent';
const { ccclass, property } = _decorator;

@ccclass('CHTPropCardCtrl')
export class CHTPropCardCtrl extends OO_Component {
    private _activeTab: number = 1;

    protected onLoad(): void {
        super.onLoad();

        // console.log(this.views)
        // TODO: 请求CharacterPropManager接口，获取主要属性和次要属性列表，渲染出来
        let majorPropList: BProp[] = CharacterPropManager.instance.getPropList("major");
        let minorPropList: BProp[] = CharacterPropManager.instance.getPropList("minor");

        for (let item of majorPropList) {
            this._renderPropItem(this.views["Board/Board1"], item);
        }
        
        for (let item of minorPropList) {
            this._renderPropItem(this.views["Board/Board2"], item);
        }

        for (let tabNode of this.views["Tabs"].children) {
            tabNode.on(Node.EventType.TOUCH_END, this._touchTab, this);
        }

        CharacterPropManager.instance.on(CEVENT_CHARACTER.PROP_CHANGE, this._updatePropItem, this);
    }

    start() {

    }

    private _renderPropItem(parentNode: Node, prop: BProp) {
        let node: Node = OO_UIManager.instance.loadUINode("common/CHTPropItem", "NONE");
        node.OO_param1 = prop;

        let label: string = prop.label;
        if (prop.percent) {
            label = `%${label}`;
        }
        node.getChildByName("Label").children[1].getComponent(Label).string = label;

        this._renderPropItemValue(node, prop);
        parentNode.addChild(node);
        node.on(Node.EventType.TOUCH_END, this._touchPropItem, this);
    }
    
    // 更新属性的值，和值的颜色
    private _renderPropItemValue(itemNode: Node, prop: BProp) {
        // 根据prop的buffPos的值判断，当前的值为正数/负数时，value的颜色改变(绿/红)
        let color = "";
        let buffColor = "#67C23A";
        let debuffColor = "#F56C6C";
        if (prop.value !== 0) {
            if (prop.buffPos) {
                if (prop.value > 0) {
                    color = buffColor;
                } else {
                    color = debuffColor;
                }
            } else {
                if (prop.value > 0) {
                    color = debuffColor;
                } else {
                    color = buffColor;
                }
            }
        }

        itemNode.getChildByName("Value").getComponent(Label).string = `${prop.value}`;
        if (color) {
            itemNode.getChildByName("Value").getComponent(Label).color = new Color(color);
        }
    }

    private _touchPropItem(e: EventTouch) {
        let targetNode: Node = e.target;
        // TODO: 点击后，弹出属性说明
        console.log(targetNode.OO_param1);
    }

    private _updatePropItem(err, keys: string[]) {
        // ["hp", "spd"]
        // 根据key更新CHTPropItem item
        keys.forEach((key: string, idx) => {
            let wrapPath: string = "";
            if (CharacterPropManager.instance.majorKeys.indexOf(key) !== -1) {
                wrapPath = "Board/Board1";
            } else if (CharacterPropManager.instance.minorKeys.indexOf(key) !== -1) {
                wrapPath = "Board/Board2";
            }
            if (wrapPath) {
                this.views[wrapPath].children.forEach((majorItemNode: Node, i) => {
                    let propKey: string = majorItemNode.OO_param1.key;
                    if (propKey === key) {
                        let prop: BProp = CharacterPropManager.instance[key];
                        this._renderPropItemValue(majorItemNode, prop);
                    }
                })
            }
        })
    }

    private _touchTab(e: EventTouch) {
        let targetTabNode: Node = e.target;
        let targetTabName: string = targetTabNode.name;
        let targetTabKey: number = Number(targetTabName.replace("Tab", ""));
        if (targetTabKey === this._activeTab) {
            return;
        }
        for (let tabNode of this.views["Tabs"].children) {
            let bgColor: Color = new Color(245, 245, 245, 0);
            let labColor: Color = new Color(245, 245, 245);
            let tabName: string = tabNode.name;
            let tabKey: string = tabName.replace("Tab", "");
            if (tabName === targetTabName) {
                bgColor = new Color(245, 245, 245);
                labColor = new Color(51, 51, 51);
                this.views[`Board/Board${tabKey}`].active = true;
            } else {
                this.views[`Board/Board${tabKey}`].active = false;
            }
            this.views[`Tabs/${tabName}/BG`].getComponent(Sprite).color = bgColor;
            this.views[`Tabs/${tabName}/Label`].getComponent(Label).color = labColor;
        }
        this._activeTab = targetTabKey;
    }

    update(deltaTime: number) {
        
    }

    protected onDestroy(): void {
        CharacterPropManager.instance.off(CEVENT_CHARACTER.PROP_CHANGE, this._updatePropItem, this);
    }
}


