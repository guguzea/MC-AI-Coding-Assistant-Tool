> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.414Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# LocationWaypoint (class)

```ts
export class LocationWaypoint extends Waypoint {
```

## Members（2）

### `constructor`
```ts
constructor(dimensionLocation: DimensionLocation, textureSelector: WaypointTextureSelector, color?: RGB);
```

@throws This function can throw errors.

{@link InvalidWaypointTextureSelectorError}
/

### `setDimensionLocation`
```ts
setDimensionLocation(dimensionLocation: DimensionLocation): void;
```

@remarks
Updates the dimension and location that this waypoint points
to.

This function can't be called in restricted-execution mode.

@param dimensionLocation
The new {@link DimensionLocation} (dimension and
coordinates) for the waypoint.
/
