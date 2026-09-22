> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.526Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ProjectileHitBlockAfterEvent (class)

```ts
export class ProjectileHitBlockAfterEvent {
```

Contains information related to a projectile hitting a
block.

## Members（7）

### `private`
```ts
private constructor();
```

### `dimension`
```ts
readonly dimension: Dimension;
```

@remarks
Dimension where this projectile hit took place.

/

### `hitVector`
```ts
readonly hitVector: Vector3;
```

@remarks
Direction vector of the projectile as it hit a block.

/

### `location`
```ts
readonly location: Vector3;
```

@remarks
Location where the projectile hit occurred.

/

### `projectile`
```ts
readonly projectile: Entity;
```

@remarks
Entity for the projectile that hit a block.

/

### `source`
```ts
readonly source?: Entity;
```

@remarks
Optional source entity that fired the projectile.

/

### `getBlockHit`
```ts
getBlockHit(): BlockHitInformation;
```

@remarks
Contains additional information about the block that was hit
by the projectile.

This function can't be called in restricted-execution mode.

/
