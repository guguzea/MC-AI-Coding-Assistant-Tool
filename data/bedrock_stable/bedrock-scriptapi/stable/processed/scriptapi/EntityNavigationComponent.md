> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.308Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityNavigationComponent (class)

```ts
export class EntityNavigationComponent extends EntityComponent {
```

## Members（20）

### `private`
```ts
private constructor();
```

### `avoidDamageBlocks`
```ts
readonly avoidDamageBlocks: boolean;
```

@remarks
Tells the pathfinder to avoid blocks that cause damage when
finding a path.

@throws This property can throw when used.
/

### `avoidPortals`
```ts
readonly avoidPortals: boolean;
```

@remarks
Tells the pathfinder to avoid portals (like nether portals)
when finding a path.

@throws This property can throw when used.
/

### `avoidSun`
```ts
readonly avoidSun: boolean;
```

@remarks
Whether or not the pathfinder should avoid tiles that are
exposed to the sun when creating paths.

@throws This property can throw when used.
/

### `avoidWater`
```ts
readonly avoidWater: boolean;
```

@remarks
Tells the pathfinder to avoid water when creating a path.

@throws This property can throw when used.
/

### `canBreach`
```ts
readonly canBreach: boolean;
```

@remarks
Tells the pathfinder whether or not it can jump out of water
(like a dolphin).

@throws This property can throw when used.
/

### `canBreakDoors`
```ts
readonly canBreakDoors: boolean;
```

@remarks
Tells the pathfinder that it can path through a closed door
and break it.

@throws This property can throw when used.
/

### `canFloat`
```ts
readonly canFloat: boolean;
```

@remarks
Tells the pathfinder whether or not it can float.

@throws This property can throw when used.
/

### `canJump`
```ts
readonly canJump: boolean;
```

@remarks
Tells the pathfinder whether or not it can jump up blocks.

@throws This property can throw when used.
/

### `canOpenDoors`
```ts
readonly canOpenDoors: boolean;
```

@remarks
Tells the pathfinder that it can path through a closed door
assuming the AI will open the door.

@throws This property can throw when used.
/

### `canOpenIronDoors`
```ts
readonly canOpenIronDoors: boolean;
```

@remarks
Tells the pathfinder that it can path through a closed iron
door assuming the AI will open the door.

@throws This property can throw when used.
/

### `canPassDoors`
```ts
readonly canPassDoors: boolean;
```

@remarks
Whether a path can be created through a door.

@throws This property can throw when used.
/

### `canPathFromAir`
```ts
readonly canPathFromAir: boolean;
```

@remarks
Tells the pathfinder that it can start pathing when in the
air.

@throws This property can throw when used.
/

### `canPathOverLava`
```ts
readonly canPathOverLava: boolean;
```

@remarks
Tells the pathfinder whether or not it can travel on the
surface of the lava.

@throws This property can throw when used.
/

### `canPathOverWater`
```ts
readonly canPathOverWater: boolean;
```

@remarks
Tells the pathfinder whether or not it can travel on the
surface of the water.

@throws This property can throw when used.
/

### `canSink`
```ts
readonly canSink: boolean;
```

@remarks
Tells the pathfinder whether or not it will be pulled down
by gravity while in water.

@throws This property can throw when used.
/

### `canSwim`
```ts
readonly canSwim: boolean;
```

@remarks
Tells the pathfinder whether or not it can path anywhere
through water and plays swimming animation along that path.

@throws This property can throw when used.
/

### `canWalk`
```ts
readonly canWalk: boolean;
```

@remarks
Tells the pathfinder whether or not it can walk on the
ground outside water.

@throws This property can throw when used.
/

### `canWalkInLava`
```ts
readonly canWalkInLava: boolean;
```

@remarks
Tells the pathfinder whether or not it can travel in lava
like walking on ground.

@throws This property can throw when used.
/

### `isAmphibious`
```ts
readonly isAmphibious: boolean;
```

@remarks
Tells the pathfinder whether or not it can walk on the
ground or go underwater.

@throws This property can throw when used.
/
