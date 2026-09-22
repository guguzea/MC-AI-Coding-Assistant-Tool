> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.513Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerSwingStartAfterEvent (class)

```ts
export class PlayerSwingStartAfterEvent {
```

Contains information regarding a player starting to swing
their arm.

## Members（4）

### `private`
```ts
private constructor();
```

### `heldItemStack`
```ts
readonly heldItemStack?: ItemStack;
```

@remarks
The item stack being held by the player at the start of
their swing.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Source Player for this event.

/

### `swingSource`
```ts
readonly swingSource: EntitySwingSource;
```

@remarks
The source of the Player swing, see {@link
EntitySwingSource}.

/
