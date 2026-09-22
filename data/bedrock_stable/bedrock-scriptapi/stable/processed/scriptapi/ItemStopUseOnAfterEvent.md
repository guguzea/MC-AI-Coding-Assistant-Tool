> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.383Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemStopUseOnAfterEvent (class)

```ts
export class ItemStopUseOnAfterEvent {
```

Contains information related to an item that has stopped
being used on a block. This event fires when a player
successfully uses an item or places a block by pressing the
Use Item / Place Block button. If multiple blocks are
placed, this event will only occur once at the beginning of
the block placement. Note: This event cannot be used with
Hoe or Axe items.

## Members（4）

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

### `itemStack`
```ts
readonly itemStack?: ItemStack;
```

@remarks
The impacted item stack that is being used on a block.

/

### `source`
```ts
readonly source: Player;
```

@remarks
Returns the source entity that triggered this item event.

/
