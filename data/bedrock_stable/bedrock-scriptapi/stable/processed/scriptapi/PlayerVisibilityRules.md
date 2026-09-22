> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.692Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerVisibilityRules (interface)

```ts
export interface PlayerVisibilityRules extends EntityVisibilityRules {
```

## Members（3）

### `showHidden`
```ts
showHidden?: boolean;
```

@remarks
Controls whether the waypoint is shown when the tracked
player is hidden. If undefined, defaults to true.

/

### `showSpectator`
```ts
showSpectator?: boolean;
```

@remarks
Controls whether the waypoint is shown when the tracked
player is in spectator mode. If undefined, defaults to true.

/

### `showSpectatorToSpectator`
```ts
showSpectatorToSpectator?: boolean;
```

@remarks
Controls whether the waypoint is shown when a spectator is
viewing another spectator player. If undefined, defaults to
true.

/
