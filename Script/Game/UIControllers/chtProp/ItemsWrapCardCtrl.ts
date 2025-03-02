import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import { DetailItem, ItemsManager } from '../../CManager/ItemsManager';
import { CEVENT_CHARACTER } from '../../CEvent';
import OO_UIManager from '../../../OO/Manager/OO_UIManager';
import { PreviewItemsCtrl } from './PreviewItemsCtrl';
const { ccclass, property } = _decorator;

@ccclass('ItemsWrapCardCtrl')
export class ItemsWrapCardCtrl extends OO_Component {
    private _previewItemsNode: Node = null;

    protected onLoad(): void {
        super.onLoad();

        console.log('ItemsWrapCardCtrl loaded!');

        this._renderItemList();

        this._previewItemsNode = OO_UIManager.instance.loadUINode("chtProp/PreviewItems", "PreviewItemsCtrl");
        OO_UIManager.instance.appendUINode(this._previewItemsNode);

        ItemsManager.instance.on(CEVENT_CHARACTER.ITEMS_CHANGE, () => {
            // TODO: 优化，当物品改变时，不需要进行整个列表重新渲染
            this._renderItemList();
        }, this);
    }

    start() {

    }

    private _renderItemList() {
        this.views["ScrollView/view/ItemList"].removeAllChildren();
        let detailItemList: DetailItem[] = ItemsManager.instance.getChtItemsList();
        detailItemList.forEach((dItem: DetailItem, i) => {
            let itemNode: Node = this.loadUINode("chtProp/ItemsIcon", "NONE");
            itemNode.OO_param1 = dItem;
            if (dItem.cnt > 1) {
                let dotNode: Node = itemNode.getChildByName("Dot");
                dotNode.active = true;
                dotNode.getComponent(Label).string = `x${dItem.cnt}`;
            }
            this.views["ScrollView/view/ItemList"].addChild(itemNode);

            this._bindTouchEvent(itemNode);
        });
    }

    // 节点点击事件，点击弹出道具详情
    private _bindTouchEvent(itemNode: Node) {
        itemNode.on(Node.EventType.TOUCH_END, () => {
            let previewItemCtrl: PreviewItemsCtrl = this._previewItemsNode.getComponent("PreviewItemsCtrl") as PreviewItemsCtrl;
            previewItemCtrl.loadView(itemNode.OO_param1);
        }, this);
    }

    update(deltaTime: number) {
        
    }
}


