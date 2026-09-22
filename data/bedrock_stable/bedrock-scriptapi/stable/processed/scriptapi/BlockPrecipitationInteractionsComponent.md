> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.173Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockPrecipitationInteractionsComponent (class)

```ts
export class BlockPrecipitationInteractionsComponent extends BlockComponent {
```

## Members（4）

### `private`
```ts
private constructor();
static readonly componentId = 'minecraft:precipitation_interactions';
```

### `accumulatesSnow`
```ts
accumulatesSnow(): boolean;
```

@remarks
Returns `true` if falling snow will accumulate naturally on
the block. Returns `false` if snow will not accumulate on
the block.

@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `isSnowLoggable`
```ts
isSnowLoggable(): boolean;
```

@remarks
Returns `true` if this block can have snow within it, like a
flower submerged in snow. Returns `false` if this block
cannot have snow within it.

@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/

### `obstructsRain`
```ts
obstructsRain(): boolean;
```

@remarks
Returns `true` if rain will not go through the block.
Returns `false` if rain should go through the block.

@throws This function can throw errors.

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
/
