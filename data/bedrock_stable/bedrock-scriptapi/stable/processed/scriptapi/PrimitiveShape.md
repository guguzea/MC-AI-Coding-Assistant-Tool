> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.524Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PrimitiveShape (class)

```ts
export class PrimitiveShape {
```

The base class for a text primitive. Represents an object in
the world and its base properties.

## Members（14）

### `private`
```ts
private constructor();
```

### `attachedTo`
```ts
attachedTo?: Entity;
```

@remarks
The entity this shape is attached to. When set, this shape
will copy the root location of the attached entity and the
shape's position will be used as an offset.

/

### `color`
```ts
color: RGBA;
```

@remarks
The color of the shape.

/

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
The dimension the shape is visible within. If the dimension
is undefined, it will display in all dimensions.

/

### `hasDuration`
```ts
readonly hasDuration: boolean;
```

@remarks
Returns true if the shape has a limited time span before
being removed.

/

### `location`
```ts
readonly location: Vector3;
```

@remarks
The location of the shape.

/

### `maximumRenderDistance`
```ts
maximumRenderDistance?: number;
```

@remarks
If defined, this distance will be used to determine how far
away this primitive will be rendered for each client. By
default the distance will match the client's render distance
setting.

Minimum Value: 0
/

### `rotation`
```ts
rotation: Vector3;
```

@remarks
The rotation of the shape (Euler angles - [Pitch, Yaw,
Roll]).

/

### `scale`
```ts
scale: number;
```

@remarks
The scale of the shape.

Bounds: [-1000, 1000]
/

### `timeLeft`
```ts
timeLeft?: number;
```

@remarks
The time left (in seconds) until this shape is automatically
removed. Returns undefined if the shape does not have a
limited life-span.

/

### `totalTimeLeft`
```ts
readonly totalTimeLeft?: number;
```

@remarks
The total initial time-span (in seconds) until this shape is
automatically removed. Returns undefined if the shape does
not have a limited life-span.

/

### `visibleTo`
```ts
visibleTo: Player[];
```

@remarks
The list of players that this shape will be visible to. If
left empty, the shape will be visible to all players.

/

### `remove`
```ts
remove(): void;
```

@remarks
Removes this shape from the world. The shape can be re-added
via the PrimitiveShapesManager's addText method.

/

### `setLocation`
```ts
setLocation(location: DimensionLocation | Vector3): void;
```

@remarks
Set the location and dimension of the shape. If the
dimension is undefined, it will display in all dimensions.

/
