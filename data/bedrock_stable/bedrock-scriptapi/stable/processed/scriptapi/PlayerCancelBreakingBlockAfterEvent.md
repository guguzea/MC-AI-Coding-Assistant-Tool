> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.442Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerCancelBreakingBlockAfterEvent (class)

```ts
export class PlayerCancelBreakingBlockAfterEvent extends BlockEvent {
```

## Members（6）

### `private`
```ts
private constructor();
```

### `blockPermutation`
```ts
readonly blockPermutation: BlockPermutation;
```

@remarks
The permutation of the block that the player cancelled
breaking.

/

### `breakProgress`
```ts
readonly breakProgress: number;
```

@remarks
The progress of breaking the block when the player cancelled
in the exclusive range (0, 1).

/

### `face`
```ts
readonly face: Direction;
```

@remarks
The face of the block that was being broken.

/

### `heldItemStack`
```ts
readonly heldItemStack?: ItemStack;
```

@remarks
The item stack that the player was using to break the block,
or undefined if empty hand.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Player that cancelled breaking the block for this event.

/
