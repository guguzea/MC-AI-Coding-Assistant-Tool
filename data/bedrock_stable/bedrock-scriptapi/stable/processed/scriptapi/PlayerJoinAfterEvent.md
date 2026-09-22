> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.496Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerJoinAfterEvent (class)

```ts
export class PlayerJoinAfterEvent {
```

Contains information regarding a player that has joined.
See the playerSpawn event for more detailed information that
could be returned after the first time a player has spawned
within the game.

## Members（3）

### `private`
```ts
private constructor();
```

### `playerId`
```ts
readonly playerId: string;
```

@remarks
Opaque string identifier of the player that joined the game.

/

### `playerName`
```ts
readonly playerName: string;
```

@remarks
Name of the player that has joined.

/
