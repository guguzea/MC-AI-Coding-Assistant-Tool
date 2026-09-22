> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.445Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerDimensionChangeAfterEvent (class)

```ts
export class PlayerDimensionChangeAfterEvent {
```

Contains information related to changes to a player's
dimension having been changed.

## Members（6）

### `private`
```ts
private constructor();
```

### `fromDimension`
```ts
readonly fromDimension: Dimension;
```

@remarks
The dimension the player is changing from.

/

### `fromLocation`
```ts
readonly fromLocation: Vector3;
```

@remarks
The location the player was at before changing dimensions.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Handle to the player that is changing dimensions.

/

### `toDimension`
```ts
readonly toDimension: Dimension;
```

@remarks
The dimension that the player is changing to.

/

### `toLocation`
```ts
readonly toLocation: Vector3;
```

@remarks
The location the player will spawn to after changing
dimensions.

/
