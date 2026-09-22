> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.674Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# GetBlocksStandingOnOptions (interface)

```ts
export interface GetBlocksStandingOnOptions {
```

Contains additional options for getBlockStandingOn and
getAllBlocksStandingOn.

## Members（2）

### `blockFilter`
```ts
blockFilter?: BlockFilter;
```

@remarks
When specified, the function will include / exclude what
block(s) are returned based on the block filter.

/

### `ignoreThinBlocks`
```ts
ignoreThinBlocks?: boolean;
```

@remarks
If true, all blocks of height 0.2 or lower like trapdoors
and carpets will be ignored, and the block underneath will
be returned.

/
