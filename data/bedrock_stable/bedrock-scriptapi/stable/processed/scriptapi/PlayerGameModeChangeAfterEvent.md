> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.450Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerGameModeChangeAfterEvent (class)

```ts
export class PlayerGameModeChangeAfterEvent {
```

Contains information regarding an event after a players game
mode is changed.

## Members（4）

### `private`
```ts
private constructor();
```

### `fromGameMode`
```ts
readonly fromGameMode: GameMode;
```

@remarks
The previous game mode before the change.

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
readonly toGameMode: GameMode;
```

@remarks
The current game mode after the change.

/
