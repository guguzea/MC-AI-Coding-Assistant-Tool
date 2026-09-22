> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.380Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemStartUseOnAfterEvent (class)

```ts
export class ItemStartUseOnAfterEvent {
```

Contains information related to an item being used on a
block. This event fires when a player presses the the Use
Item / Place Block button to successfully use an item or
place a block. Fires for the first block that is interacted
with when performing a build action. Note: This event cannot
be used with Hoe or Axe items.

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
The block that the item is used on.

/

### `blockFace`
```ts
readonly blockFace: Direction;
```

@remarks
The face of the block that an item is being used on.

/

### `itemStack`
```ts
readonly itemStack?: ItemStack;
```

@remarks
The impacted item stack that is starting to be used. Can be
undefined in some gameplay scenarios like pushing a button
with an empty hand.

/

### `source`
```ts
readonly source: Player;
```

@remarks
Returns the source entity that triggered this item event.

/
