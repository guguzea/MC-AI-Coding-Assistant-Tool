> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.257Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityHitBlockAfterEvent (class)

```ts
export class EntityHitBlockAfterEvent {
```

Contains information related to an entity hitting a block.

## Members（5）

### `private`
```ts
private constructor();
```

### `blockFace`
```ts
readonly blockFace: Direction;
```

@remarks
Face of the block that was hit.

/

### `damagingEntity`
```ts
readonly damagingEntity: Entity;
```

@remarks
Entity that made the attack.

/

### `hitBlock`
```ts
readonly hitBlock: Block;
```

@remarks
Block that was hit by the attack.

/

### `hitBlockPermutation`
```ts
readonly hitBlockPermutation: BlockPermutation;
```

@remarks
Block permutation that was hit by the attack.

/
