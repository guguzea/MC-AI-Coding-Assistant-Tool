> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.143Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockComponentBlockBreakEvent (class)

```ts
export class BlockComponentBlockBreakEvent extends BlockEvent {
```

## Members（4）

### `private`
```ts
private constructor();
```

### `blockDestructionSource`
```ts
readonly blockDestructionSource?: Block;
```

@remarks
The block that caused destruction.

/

### `brokenBlockPermutation`
```ts
readonly brokenBlockPermutation: BlockPermutation;
```

@remarks
Returns permutation information about this block before it
was broken.

/

### `entitySource`
```ts
readonly entitySource?: Entity;
```

@remarks
The Actor that caused destruction.

/
