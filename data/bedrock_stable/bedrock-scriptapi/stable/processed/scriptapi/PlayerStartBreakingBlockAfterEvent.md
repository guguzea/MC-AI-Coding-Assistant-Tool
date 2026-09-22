> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.510Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerStartBreakingBlockAfterEvent (class)

```ts
export class PlayerStartBreakingBlockAfterEvent extends BlockEvent {
```

## Members（5）

### `private`
```ts
private constructor();
```

### `blockPermutation`
```ts
readonly blockPermutation: BlockPermutation;
```

@remarks
The permutation of the block that the player is starting to
break.

/

### `face`
```ts
readonly face: Direction;
```

@remarks
The face of the block being broken.

/

### `heldItemStack`
```ts
readonly heldItemStack?: ItemStack;
```

@remarks
The item stack that the player is using to break the block,
or undefined if empty hand.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Player that started breaking the block for this event.

/
