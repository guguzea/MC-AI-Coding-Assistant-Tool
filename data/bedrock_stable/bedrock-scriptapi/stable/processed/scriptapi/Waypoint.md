> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.580Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Waypoint (class)

```ts
export class Waypoint {
```

Base class for waypoints displayed on the player's locator
bar. Waypoints can track locations or entities and are
rendered with customizable textures and colors.

Waypoints act as shared handles that can be added to
multiple players' locator bars. When you modify a waypoint's
properties (such as color, texture, or enabled state), the
changes are reflected for all players who have that waypoint
in their locator bar. This allows you to efficiently manage
waypoints across multiple players without creating separate
instances for each player.

## Members（7）

### `private`
```ts
private constructor();
```

### `color`
```ts
color?: RGB;
```

@remarks
Optional {@link RGB} color tint applied to the waypoint
icon. If not specified, the waypoint uses its default color.

This property can't be edited in restricted-execution mode.

/

### `isEnabled`
```ts
isEnabled: boolean;
```

@remarks
Controls whether the waypoint is currently displayed on the
player's screen. When disabled, the waypoint is hidden but
remains valid.

This property can't be edited in restricted-execution mode.

/

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether the waypoint is currently valid. A waypoint
becomes invalid when its tracked entity is no longer valid.

/

### `textureSelector`
```ts
textureSelector: WaypointTextureSelector;
```

@remarks
The {@link WaypointTextureSelector} that determines which
icon texture is displayed for the waypoint based on distance
or other criteria.

This property can't be edited in restricted-execution mode.

/

### `getDimensionLocation`
```ts
getDimensionLocation(): DimensionLocation;
```

@remarks
Gets the current {@link DimensionLocation} of the waypoint.
For entity waypoints, this returns the entity's current
position. For location waypoints, this returns the stored
location.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link InvalidWaypointError}

{@link InvalidWaypointTextureSelectorError}
/

### `remove`
```ts
remove(): void;
```

@remarks
Removes the waypoint from all locator bars it has been added
to. This affects all players who have this waypoint in their
locator bar.

This function can't be called in restricted-execution mode.

/
