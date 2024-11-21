import { _decorator, Component, Node, v2, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

// 计量单位，游戏中 1 = 1个GP_UNIT的距离
export const GP_UNIT = 30;

// 计算两点距离
export const getDistance = function (start: Vec2 | Vec3, end: Vec2 | Vec3): number {
  let pos = v2(start.x - end.x, start.y - end.y);
  let dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
  return dis;
}