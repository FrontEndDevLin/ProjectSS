export enum CEVENT_COMPASS {
    TOUCH_START = 10,
    TOUCH_END,
    TOUCH_MOVE
}

export enum CEVENT_GAME {
    START = 40,
    PASS
}

export enum CEVENT_PREPARE {
    UPDATE_STORE = 70,
    UPDATE_WEAPON
}

export enum CEVENT_CHARACTER {
    EXP_CHANGE = 90,
    LEVEL_UP,
    // 属性变化
    PROP_CHANGE,
    // 道具变化
    ITEMS_CHANGE
}

export enum CEVENT_CURRENCY {
    CRY_CHANGE = 100,
    STO_CHANGE
}
