> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.162Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockEvent (class)

```ts
export class BlockEvent {
```

Contains information regarding an event that impacts a
specific block.

## Members（3）

### `private`
```ts
private constructor();
```

### `block`
```ts
readonly block: Block;
```

@remarks
Block currently in the world at the location of this event.

/

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
Dimension that contains the block that is the subject of
this event.

/
