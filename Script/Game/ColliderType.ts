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
    WEAPON_DOMAIN = 1<<4
}

export enum CLD_ENEMY {
    ENEMY_1 = 100
}

// 弹头枚举数据放在db里比较好？
export enum CLD_BULLET {
    BULLET_1 = 500
}

