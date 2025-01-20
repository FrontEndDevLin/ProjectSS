import { _decorator, Component, Node, v2, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

// 计量单位，游戏中 1 = 1个GP_UNIT的距离
export const GP_UNIT = 30;

// 计算两点距离
export const getDistance = function (start: Vec2 | Vec3, end: Vec2 | Vec3): number {
  let pos = v2(start.x - end.x, start.y - end.y);
  let dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
  return dis;
}

// 我们知道一个角度，求这个角度的向量
// 1：先把角度转成弧度，原因同上。弧度 = 角度*PI/180.0f
// 2：用刚才的弧度  x = cos(弧度)  y = sin(弧度)
export const getVectorByAngle = function (angle: number) {
  let arc: number = angle * Math.PI / 180;
  return v3(Math.cos(arc), Math.sin(arc));
}

export const SCREEN_WIDTH: number = 720;
export const SCREEN_HEIGHT: number = 1280;

export const getRandomNumber = function(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getFloatNumber = function (number: number, n: number = 2): number {
  return parseFloat(number.toFixed(n));
}
