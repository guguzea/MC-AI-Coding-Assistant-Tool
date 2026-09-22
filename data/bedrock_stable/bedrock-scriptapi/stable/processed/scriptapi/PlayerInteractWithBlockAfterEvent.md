> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.482Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerInteractWithBlockAfterEvent (class)

```ts
export class PlayerInteractWithBlockAfterEvent {
```

Contains information regarding an event after a player
successfully interacts with a block.

## Members（8）

### `private`
```ts
private constructor();
```

### `beforeItemStack`
```ts
readonly beforeItemStack?: ItemStack;
```

@remarks
The ItemStack before the interaction succeeded, or undefined
if hand is empty.

/

### `block`
```ts
readonly block: Block;
```

@remarks
The block that will be interacted with.

/

### `blockFace`
```ts
readonly blockFace: Direction;
```

@remarks
The face of the block that is being interacted with.

/

### `faceLocation`
```ts
readonly faceLocation: Vector3;
```

@remarks
Location relative to the bottom north-west corner of the
block where the item is placed.

/

### `isFirstEvent`
```ts
readonly isFirstEvent: boolean;
```

@remarks
This value will be true if the event was triggered on
players initial interaction button press and false on events
triggered from holding the interaction button.

/

### `itemStack`
```ts
readonly itemStack?: ItemStack;
```

@remarks
The ItemStack after the interaction succeeded, or undefined
if hand is empty.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Source Player for this event.

/
