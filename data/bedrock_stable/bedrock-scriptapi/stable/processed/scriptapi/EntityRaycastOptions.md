> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.670Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityRaycastOptions (interface)

```ts
export interface EntityRaycastOptions extends EntityFilter {
```

## Members（4）

### `ignoreBlockCollision`
```ts
ignoreBlockCollision?: boolean;
```

@remarks
If true, blocks will not be considered as blocks that 'stop'
the raycast.

/

### `includeLiquidBlocks`
```ts
includeLiquidBlocks?: boolean;
```

@remarks
If true, liquid blocks will be considered as blocks that
'stop' the raycast.

/

### `includePassableBlocks`
```ts
includePassableBlocks?: boolean;
```

@remarks
If true, passable blocks like vines and flowers will be
considered as blocks that 'stop' the raycast.

/

### `maxDistance`
```ts
maxDistance?: number;
```

@remarks
Maximum distance, in blocks, to process the raycast.

/
