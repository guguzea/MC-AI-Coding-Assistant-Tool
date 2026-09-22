> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.488Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerInteractWithEntityAfterEvent (class)

```ts
export class PlayerInteractWithEntityAfterEvent {
```

Contains information regarding an event after a player
successfully interacts with an entity.

## Members（5）

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

### `target`
```ts
readonly target: Entity;
```

@remarks
The entity that will be interacted with.

/
