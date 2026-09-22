> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.671Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityVisibilityRules (interface)

```ts
export interface EntityVisibilityRules {
```

Controls when a waypoint is visible based on the state of
the entity it tracks. These rules allow filtering waypoint
visibility by entity conditions like sneaking, invisibility,
and death state.

## Members（3）

### `showDead`
```ts
showDead?: boolean;
```

@remarks
Controls whether the waypoint is shown when the tracked
entity is dead. If undefined, defaults to true.

/

### `showInvisible`
```ts
showInvisible?: boolean;
```

@remarks
Controls whether the waypoint is shown when the tracked
entity is invisible. If undefined, defaults to true.

/

### `showSneaking`
```ts
showSneaking?: boolean;
```

@remarks
Controls whether the waypoint is shown when the tracked
entity is sneaking. If undefined, defaults to true.

/
