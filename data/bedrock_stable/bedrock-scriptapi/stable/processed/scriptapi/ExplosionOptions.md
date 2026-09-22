> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.673Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ExplosionOptions (interface)

```ts
export interface ExplosionOptions {
```

Additional configuration options for the {@link
Dimension.createExplosion} method.
@example createNoBlockExplosion.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function createNoBlockExplosion(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const explodeNoBlocksLoc = Vector3Utils.floor(Vector3Utils.add(targetLocation, { x: 1, y: 2, z: 1 }));

  log('Creating an explosion of radius 15 that does not break blocks.');
  targetLocation.dimension.createExplosion(explodeNoBlocksLoc, 15, { breaksBlocks: false });
}
```
@example createExplosions.ts
```typescript
import { DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function createExplosions(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  const explosionLoc = Vector3Utils.add(targetLocation, { x: 0.5, y: 0.5, z: 0.5 });

  log('Creating an explosion of radius 15 that causes fire.');
  targetLocation.dimension.createExplosion(explosionLoc, 15, { causesFire: true });

  const belowWaterLoc = Vector3Utils.add(targetLocation, { x: 3, y: 1, z: 3 });

  log('Creating an explosion of radius 10 that can go underwater.');
  targetLocation.dimension.createExplosion(belowWaterLoc, 10, { allowUnderwater: true });
}
```

## Members（4）

### `allowUnderwater`
```ts
allowUnderwater?: boolean;
```

@remarks
Whether parts of the explosion also impact underwater.

/

### `breaksBlocks`
```ts
breaksBlocks?: boolean;
```

@remarks
Whether the explosion will break blocks within the blast
radius.

/

### `causesFire`
```ts
causesFire?: boolean;
```

@remarks
If true, the explosion is accompanied by fires within or
near the blast radius.

/

### `source`
```ts
source?: Entity;
```

@remarks
Optional source of the explosion.

/
