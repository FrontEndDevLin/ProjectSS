export enum CEVENT_COMPASS {
    TOUCH_START = 10,
    TOUCH_END,
    TOUCH_MOVE
}

// 进入章节前的预载，所有的都预载完后开始计时
export enum CEVENT_PREPLAY {
    COUNTDOWN = 20,
    MAP,
    CHARACTER,
    ENEMY_ROLE
}

export enum CEVENT_GAME {
    START = 40
}

export enum CEVENT_COUNTDOWN {
    OVER = 60
}