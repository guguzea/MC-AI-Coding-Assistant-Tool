> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.413Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ListBlockVolume (class)

```ts
export class ListBlockVolume extends BlockVolumeBase {
```

## Members（3）

### `constructor`
```ts
constructor(locations: Vector3[]);
```

@remarks
Creates a new instance of ListBlockVolume.

@param locations
Initial array of block locations that ListBlockVolume will
be constructed with.
/

### `add`
```ts
add(locations: Vector3[]): void;
```

@remarks
Insert block locations into container.

@param locations
Array of block locations to be inserted into container.
/

### `remove`
```ts
remove(locations: Vector3[]): void;
```

@remarks
Remove block locations from container.

@param locations
Array of block locations to be removed from container.
/
