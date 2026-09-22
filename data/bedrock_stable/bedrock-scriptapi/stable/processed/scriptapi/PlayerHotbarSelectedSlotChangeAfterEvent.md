> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.454Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerHotbarSelectedSlotChangeAfterEvent (class)

```ts
export class PlayerHotbarSelectedSlotChangeAfterEvent {
```

Contains information regarding an event after changing the
selected hotbar slot for a player.

## Members（5）

### `private`
```ts
private constructor();
```

### `itemStack`
```ts
readonly itemStack?: ItemStack;
```

@remarks
The item stack of the new slot selected.

/

### `newSlotSelected`
```ts
readonly newSlotSelected: number;
```

@remarks
The new hotbar slot index selected.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Source Player for this event.

/

### `previousSlotSelected`
```ts
readonly previousSlotSelected: number;
```

@remarks
The previous hotbar slot index selected.

/
