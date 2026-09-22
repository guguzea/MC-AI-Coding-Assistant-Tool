> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.591Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AABB (interface)

```ts
export interface AABB {
```

Axis-aligned bounding box.

## Members（2）

### `center`
```ts
center: Vector3;
```

@remarks
The centerpoint of the box.

/

### `extent`
```ts
extent: Vector3;
```

@remarks
Absolute distance from the centerpoint to the bounds of the
box. Equivalent to half of the box's length, height and
width. Will always be treated as positive.

/
