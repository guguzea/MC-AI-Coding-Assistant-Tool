> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.340Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ExplosionAfterEvent (class)

```ts
export class ExplosionAfterEvent {
```

Contains information regarding an explosion that has
happened.

## Members（4）

### `private`
```ts
private constructor();
```

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
Dimension where the explosion has occurred.

/

### `source`
```ts
readonly source?: Entity;
```

@remarks
Optional source of the explosion.

/

### `getImpactedBlocks`
```ts
getImpactedBlocks(): Block[];
```

@remarks
A collection of blocks impacted by this explosion event.

/
