export type Vec2 = {
  x: number;
  y: number;
};

export type Target = {
  type: TargetType;
  startPos: Vec2;
  isDouble: boolean;
  isLife: boolean;
  points: Vec2[];
};

export type Block = {
  pos: Vec2;
  size: Vec2;
};

export type Level = {
  bullets: number;
  targets: Target[];
  blocks: Block[];
};

export type TargetType =
  | "Target"
  | "Target_Small"
  | "Target_Wide"
  | "Target_Grow";
