export const CLD_CTR = 1;

// 武器领域，警戒范围，攻击范围
export enum WEAPON_DOMAIN {
    ALERT = 1,
    ATTACK = 2
}

export enum GP_GROUP {
    DEFAULT = 1<<0,
    CHARACTER = 1<<1,
    BULLET = 1<<2,
    ENEMY = 1<<3,
    WEAPON_DOMAIN = 1<<4,
    CTR_RIM = 1<<5,
    DROP_ITEM = 1<<6
}

export enum CLD_ENEMY {
    ENEMY_1 = 100
}

// 围绕角色的碰撞体，如拾取范围碰撞体等 8-16
export enum CTR_RIM {
    EXP_PICK = 9
}

// 掉落物
export enum DROP_ITEM {
    EXP = 17,
    TROPHY = 18
}
