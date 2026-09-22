> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.601Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockFillOptions (interface)

```ts
export interface BlockFillOptions {
```

Contains additional options for a block fill operation.

## Members（2）

### `blockFilter`
```ts
blockFilter?: BlockFilter;
```

@remarks
When specified, the fill operation will include / exclude
the blocks added to the block filter.

/

### `ignoreChunkBoundErrors`
```ts
ignoreChunkBoundErrors?: boolean;
```

@remarks
When true fillBlocks will not error if part of the fill
volume is outside of loaded chunks bounds. Instead it will
just fill the blocks that are inside the loaded chunk bounds
and ignoring blocks outside.

/
