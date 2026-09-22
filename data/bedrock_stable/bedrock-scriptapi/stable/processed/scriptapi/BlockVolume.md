> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.181Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockVolume (class)

```ts
export class BlockVolume extends BlockVolumeBase {
```

## Members（5）

### `'from'`
```ts
'from': Vector3;
```

@remarks
A world block location that represents a corner in a 3D
rectangle

/

### `to`
```ts
to: Vector3;
constructor(from: Vector3, to: Vector3);
```

@remarks
A world block location that represents the opposite corner
in a 3D rectangle

/

### `doesLocationTouchFaces`
```ts
doesLocationTouchFaces(pos: Vector3): boolean;
```

@remarks
Check to see if the given location is directly adjacent to
the outer surface of a BlockVolume.


@param pos
The world block location to test
@returns
If the location is either inside or more than 0 blocks away,
the function will return false.
If the location is directly contacting the outer surface of
the BlockVolume, the function will return true.
/

### `doesVolumeTouchFaces`
```ts
doesVolumeTouchFaces(other: BlockVolume): boolean;
```

@remarks
Check to see if a two block volumes are directly adjacent
and two faces touch.

@param other
The volume to test
@returns
If the outer faces of both block volumes touch and are
directly adjacent at any point, return true.
/

### `intersects`
```ts
intersects(other: BlockVolume): BlockVolumeIntersection;
```

@remarks
Return an enumeration which represents the intersection
between two BlockVolume objects

/
