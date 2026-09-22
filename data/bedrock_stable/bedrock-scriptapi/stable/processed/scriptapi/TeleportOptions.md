> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.707Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TeleportOptions (interface)

```ts
export interface TeleportOptions {
```

Contains additional options for teleporting an entity.
@example teleport.ts
```typescript
import { system, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function teleport(targetLocation: DimensionLocation) {
  const cow = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Cow, targetLocation);

  system.runTimeout(() => {
    cow.teleport(
      { x: targetLocation.x + 2, y: targetLocation.y + 2, z: targetLocation.z + 2 },
      {
        facingLocation: targetLocation,
      }
    );
  }, 20);
}
```
@example teleportMovement.ts
```typescript
import { system, DimensionLocation } from '@minecraft/server';
import { MinecraftEntityTypes } from '@minecraft/vanilla-data';

function teleportMovement(targetLocation: DimensionLocation) {
  const pig = targetLocation.dimension.spawnEntity(MinecraftEntityTypes.Pig, targetLocation);

  let inc = 1;
  const runId = system.runInterval(() => {
    pig.teleport(
      { x: targetLocation.x + inc / 4, y: targetLocation.y + inc / 4, z: targetLocation.z + inc / 4 },
      {
        facingLocation: targetLocation,
      }
    );

    if (inc > 100) {
      system.clearRun(runId);
    }
    inc++;
  }, 4);
}
```

## Members（5）

### `checkForBlocks`
```ts
checkForBlocks?: boolean;
```

@remarks
Whether to check whether blocks will block the entity after
teleport.

/

### `dimension`
```ts
dimension?: Dimension;
```

@remarks
Dimension to potentially move the entity to.  If not
specified, the entity is teleported within the dimension
that they reside.

/

### `facingLocation`
```ts
facingLocation?: Vector3;
```

@remarks
Location that the entity should be facing after teleport.

/

### `keepVelocity`
```ts
keepVelocity?: boolean;
```

@remarks
Whether to retain the entities velocity after teleport.

/

### `rotation`
```ts
rotation?: Vector2;
```

@remarks
Rotation of the entity after teleport.

/
