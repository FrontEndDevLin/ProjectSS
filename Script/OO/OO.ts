import { _decorator, Component, Node, UI } from 'cc';
const { ccclass, property } = _decorator;

import OO_MsgManager from './Manager/OO_MsgManager';
import OO_ResourceManager from './Manager/OO_ResourceManager';
import OO_UIManager from './Manager/OO_UIManager';
import Main from '../Game/Main';

interface View {
    [viewPath: string]: Node
}

export class OO_Component extends Component {
    protected views: View = {};

    private _loadViews(root: Node, path: string = ""): void {
        let children = root.children;
        for (let node of children) {
            let p = path + node.name;
            this.views[p] = node;
            if (node.children.length) {
                this._loadViews(node, `${p}/`);
            }
        }
    }

    protected onLoad(): void {
        this.views = {};
        this._loadViews(this.node);
    }
}

@ccclass('OO')
export default class OO extends Component {
    protected onLoad(): void {
        this.node.addComponent(OO_MsgManager);
        this.node.addComponent(OO_ResourceManager);
        this.node.addComponent(OO_UIManager);

        this.node.addComponent(Main);

        console.log(`framework [OO] started.`);
        Main.instance.runGame();
    }
}
