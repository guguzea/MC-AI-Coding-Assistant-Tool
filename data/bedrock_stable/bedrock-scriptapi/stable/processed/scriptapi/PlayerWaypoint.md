> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.515Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerWaypoint (class)

```ts
export class PlayerWaypoint extends EntityWaypoint {
```

## Members（2）

### `playerRules`
```ts
readonly playerRules: PlayerVisibilityRules;
```

@remarks
The {@link PlayerVisibilityRules} that control when the
waypoint is shown based on the player's state (e.g., hidden,
spectator mode, spectator viewing another spectator).

@throws This property can throw when used.

{@link InvalidWaypointError}

{@link InvalidWaypointTextureSelectorError}
/

### `constructor`
```ts
constructor(
  player: Player,
  textureSelector: WaypointTextureSelector,
  playerRules: PlayerVisibilityRules,
  color?: RGB,
);
```

@throws This function can throw errors.

{@link InvalidWaypointTextureSelectorError}
/
