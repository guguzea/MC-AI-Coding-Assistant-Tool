> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.391Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemUseOnEvent (class)

```ts
export class ItemUseOnEvent {
```

Contains information regarding the use of an item on a
block.

## Members（5）

### `private`
```ts
private constructor();
```

### `block`
```ts
readonly block: Block;
```

@remarks
The block impacted by this event.

/

### `blockFace`
```ts
readonly blockFace: Direction;
```

@remarks
The face of the block that the item was used on.

/

### `faceLocation`
```ts
readonly faceLocation: Vector3;
```

@remarks
Location relative to the bottom north-west corner of the
block that the item was used on.

/

### `itemStack`
```ts
readonly itemStack: ItemStack;
```

@remarks
The item stack used on the block.

/
