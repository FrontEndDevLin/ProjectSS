import { SpriteFrame, Vec3 } from "cc"

export interface Callback {
    (error: any, data?: any): void
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
    max_dis: number
}

// 子弹初始化(initAttr方法)参数
export interface BulletInitParams {
    attr: BulletAttr,
    vector: Vec3
}

// 属性标签，用于角色、敌人属性使用
export interface BProp {
    key: string,
    label?: string,
    group?: number,
    value?: number,
    // 是否使用百分比计算
    percent?: boolean,
    // true -> 当value值为正数时，为正向buff；false -> value值为负数时，为正向buff
    buffPos?: boolean
}

export interface Buff {
    type?: string,
    prop: string,
    value: number
}

// 角色基础数值支撑属性
export interface CHTBaseProp {
    range: number,
    dmg: number,
    range_dmg: number,
    melee_dmg: number,
    spd: number,
    pick_range: number
}

// 角色通用属性
export interface CHTCommonProp extends CHTBaseProp {
    hp: number,
    atk_spd: number,
    def: number,
    avd: number,
    pick_range: number
}
