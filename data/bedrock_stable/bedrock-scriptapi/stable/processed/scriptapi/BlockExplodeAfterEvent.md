> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.163Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockExplodeAfterEvent (class)

```ts
export class BlockExplodeAfterEvent extends BlockEvent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `explodedBlockPermutation`
```ts
readonly explodedBlockPermutation: BlockPermutation;
```

@remarks
Description of the block that has exploded.

/

### `source`
```ts
readonly source?: Entity;
```

@remarks
Optional source of the explosion.

/
