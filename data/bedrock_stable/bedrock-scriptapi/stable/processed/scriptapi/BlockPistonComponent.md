> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.172Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockPistonComponent (class)

```ts
export class BlockPistonComponent extends BlockComponent {
```

## Members（5）

### `private`
```ts
private constructor();
```

### `isMoving`
```ts
readonly isMoving: boolean;
```

@remarks
Whether the piston is in the process of expanding or
retracting.

@throws This property can throw when used.
/

### `state`
```ts
readonly state: BlockPistonState;
static readonly componentId = 'minecraft:piston';
```

@remarks
The current state of the piston.

@throws This property can throw when used.
/

### `getAttachedBlocks`
```ts
getAttachedBlocks(): Block[];
```

@remarks
Retrieves a set of blocks that this piston is connected
with.

@throws This function can throw errors.
/

### `getAttachedBlocksLocations`
```ts
getAttachedBlocksLocations(): Vector3[];
```

@remarks
Retrieves a set of block locations that this piston is
connected with.

@throws This function can throw errors.
/
