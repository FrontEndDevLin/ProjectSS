import {
    _decorator,
    Node,
    find,
    instantiate,
    Prefab,
    Component
} from 'cc';
import OO_ResourceManager from './OO_ResourceManager';
import OO_Manager from '../OO_Manager';
import { Callback } from '../Interface';
export default class OO_UIManager extends OO_Manager {
    static instance: OO_UIManager = null;
    public rootNode: Node = find("Canvas");

    public abName: string = "GUI";

    protected onLoad(): void {
        if (!OO_UIManager.instance) {
            OO_UIManager.instance = this;
        } else {
            this.destroy();
            return;
        }
    }

    // public showUnVisableUI(uiName, parentNode: Node = this.rootNode) {
    //     let uiPrefab = OO_ResourceManager.instance.getAssets(this.abName, `Prefabs/${uiName}`) as Prefab;
    //     if (!uiPrefab) {
    //         return;
    //     }
    //     const uiNode: Node = instantiate(uiPrefab);
    //     const scriptName: string = `${uiName}Ctrl`;
    //     try {
    //         uiNode.addComponent(scriptName);
    //     } catch (error) {
    //         console.info(`[OO_UIManager]:showUI:prefab ${uiName} doesn't have script ${scriptName}`);
    //     }
    // }

    public showUI(uiName: string, parentNode: Node = this.rootNode, scriptName?: string): Node {
        const uiNode: Node = this.loadUINode(uiName, scriptName);
        if (!uiNode) {
            return null;
        }
        return this.appendUINode(uiNode, parentNode);
    }

    public appendUINode(uiNode: Node, parentNode: Node = this.rootNode): Node {
        parentNode.addChild(uiNode);
        return uiNode;
    }
    public loadUINode(uiName: string, scriptName?: string): Node {
        let uiPrefab = OO_ResourceManager.instance.getAssets(this.abName, `Prefabs/${uiName}`) as Prefab;
        if (!uiPrefab) {
            return null;
        }
        const uiNode: Node = instantiate(uiPrefab);
        scriptName = scriptName || `${uiName}Ctrl`;
        try {
            uiNode.addComponent(scriptName);
        } catch (error) {
            console.info(`[OO_UIManager]:showUI:prefab add script ${scriptName} error`);
            // console.info(error);
        }
        return uiNode;
    }

    public removeUI(uiName: string, parentNode: Node = this.rootNode): void {
        const uiNode: Node = parentNode.getChildByName(uiName);
        if (uiNode) {
            uiNode.destroy();
            // parentNode.removeChild(uiNode);
        }
    }
}
