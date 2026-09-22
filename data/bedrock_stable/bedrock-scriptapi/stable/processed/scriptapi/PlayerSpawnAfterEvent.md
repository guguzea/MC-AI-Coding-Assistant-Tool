> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.507Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerSpawnAfterEvent (class)

```ts
export class PlayerSpawnAfterEvent {
```

An event that contains more information about a player
spawning.

## Members（3）

### `private`
```ts
private constructor();
```

### `initialSpawn`
```ts
initialSpawn: boolean;
```

@remarks
If true, this is the initial spawn of a player after joining
the game.

This property can't be edited in restricted-execution mode.

/

### `player`
```ts
player: Player;
```

@remarks
Object that represents the player that joined the game.

This property can't be edited in restricted-execution mode.

/
