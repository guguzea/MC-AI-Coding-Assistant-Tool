> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.595Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockBoundingBox (interface)

```ts
export interface BlockBoundingBox {
```

A BlockBoundingBox is an interface to an object which
represents an AABB aligned rectangle.
The BlockBoundingBox assumes that it was created in a valid
state (min <= max) but cannot guarantee it (unless it was
created using the associated {@link
@minecraft/server.BlockBoundingBoxUtils} utility functions.
The min/max coordinates represent the diametrically opposite
corners of the rectangle.
The BlockBoundingBox is not a representation of blocks - it
has no association with any type, it is just a mathematical
construct - so a rectangle with
( 0,0,0 ) -> ( 0,0,0 )
has a size of ( 0,0,0 ) (unlike the very similar {@link
BlockVolume} object)

## Members（2）

### `max`
```ts
max: Vector3;
```

@remarks
A {@link Vector3} that represents the largest corner of the
rectangle

/

### `min`
```ts
min: Vector3;
```

@remarks
A {@link Vector3} that represents the smallest corner of the
rectangle

/
