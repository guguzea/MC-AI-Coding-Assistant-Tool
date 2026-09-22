> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.714Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# WaypointTextureSelector (interface)

```ts
export interface WaypointTextureSelector {
```

Defines how waypoint textures change based on distance.
Contains a list of texture bounds that determine which
texture is displayed at different distance ranges.

## Members（1）

### `textureBoundsList`
```ts
textureBoundsList: WaypointTextureBounds[];
```

@remarks
An array of {@link WaypointTextureBounds} that define which
textures are displayed at different distance ranges. The
system evaluates these bounds to determine the appropriate
texture based on the current distance to the waypoint. The
list has a maximum size limit of 16.

/
