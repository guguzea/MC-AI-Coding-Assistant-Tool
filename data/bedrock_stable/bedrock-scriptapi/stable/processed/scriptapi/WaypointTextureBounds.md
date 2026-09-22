> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.713Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# WaypointTextureBounds (interface)

```ts
export interface WaypointTextureBounds {
```

Defines a texture and the distance range in which it should
be displayed. Used within a {@link WaypointTextureSelector}
to create distance-based texture switching.

## Members（3）

### `lowerBound`
```ts
lowerBound: number;
```

@remarks
The lower distance bound for this texture. The texture is
displayed when the distance to the waypoint is greater than
this value. Value must be greater than or equal to 0.

Minimum Value: 0
/

### `texture`
```ts
texture: CustomTexture | WaypointTexture;
```

@remarks
The {@link WaypointTexture} or {@link CustomTexture} to
display within this distance range.

/

### `upperBound`
```ts
upperBound?: number;
```

@remarks
The upper distance bound for this texture. The texture is
displayed when the distance to the waypoint is less than or
equal to this value. If undefined, there is no upper limit.
Value must be greater than or equal to 0.

Minimum Value: 0
/
