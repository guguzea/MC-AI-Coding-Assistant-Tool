> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.543Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Seat (class)

```ts
export class Seat {
```

Describes a particular seating position on this rideable
entity.

## Members（6）

### `private`
```ts
private constructor();
```

### `lockRiderRotation`
```ts
readonly lockRiderRotation: number;
```

@remarks
Angle in degrees that a rider is allowed to rotate while
riding this entity.

/

### `maxRiderCount`
```ts
readonly maxRiderCount: number;
```

@remarks
A maximum number of riders that this seat can support.

/

### `minRiderCount`
```ts
readonly minRiderCount: number;
```

@remarks
A minimum number of riders that can be placed in this seat
position, if this seat is to be filled.

/

### `position`
```ts
readonly position: Vector3;
```

@remarks
Physical location of this seat, relative to the entity's
location.

/

### `seatRotation`
```ts
readonly seatRotation: number;
```

@remarks
Angle in degrees to rotate riders by.

/
