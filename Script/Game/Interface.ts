import { SpriteFrame, Vec3 } from "cc"

export interface Callback {
    (error: any, data?: any): void
}
export interface CharacterAttribute {
    speed: number
}
export interface WeaponAttribute {
    range: number,
    damage: number
}
export interface WeaponData {
    name: string,
    id: string,
    icon: string,
    iconSF: SpriteFrame,
    attr: WeaponAttribute,
    type?: number,
    bullet?: string,
    script?: string
}
export interface WeaponSlotInfo {
    uuid: string,
    weaponName: string
}

export interface BulletAttr {
    id: string,
    prefab: string,
    // 飞行速度，伤害、穿透数由武器决定？
    speed: number,
    // 最大飞行距离
    maxDis: number
}

// 子弹初始化(initAttr方法)参数
export interface BulletInitParams {
    attr: BulletAttr,
    vector: Vec3
}