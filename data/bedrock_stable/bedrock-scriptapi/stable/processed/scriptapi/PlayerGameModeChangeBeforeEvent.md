> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.452Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerGameModeChangeBeforeEvent (class)

```ts
export class PlayerGameModeChangeBeforeEvent {
```

Contains information regarding an event before a player
interacts with an entity.

## Members（5）

### `private`
```ts
private constructor();
```

### `cancel`
```ts
cancel: boolean;
```

@remarks
If set to true the game mode change will be cancelled.

/

### `fromGameMode`
```ts
readonly fromGameMode: GameMode;
```

@remarks
The current game mode.

/

### `player`
```ts
readonly player: Player;
```

@remarks
Source Player for this event.

/

### `toGameMode`
```ts
toGameMode: GameMode;
```

@remarks
The game mode being changed to.

/
