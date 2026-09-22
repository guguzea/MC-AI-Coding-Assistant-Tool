> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.327Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntitySpawnAfterEventSignal (class)

```ts
export class EntitySpawnAfterEventSignal {
```

Registers a script-based event handler for handling what
happens when an entity spawns.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(callback: (arg0: EntitySpawnAfterEvent) => void): (arg0: EntitySpawnAfterEvent) => void;
```

@remarks
Method to register an event handler for what happens when an
entity spawns.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
Function that handles the spawn event.
@example logEntitySpawnEvent.ts
```typescript
import { world, system, EntitySpawnAfterEvent, DimensionLocation } from '@minecraft/server';
import { Vector3Utils } from '@minecraft/math';

function logEntitySpawnEvent(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // register a new function that is called when a new entity is created.
  world.afterEvents.entitySpawn.subscribe((entityEvent: EntitySpawnAfterEvent) => {
    if (entityEvent && entityEvent.entity) {
      log(`New entity of type ${entityEvent.entity.typeId} created!`, 1);
    } else {
      log(`The entity event did not work as expected.`, -1);
    }
  });

  system.runTimeout(() => {
    targetLocation.dimension.spawnEntity(
      'minecraft:horse<minecraft:ageable_grow_up>',
      Vector3Utils.add(targetLocation, { x: 0, y: 1, z: 0 })
    );
  }, 20);
}
```
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: EntitySpawnAfterEvent) => void): void;
```

@remarks
Unregisters a method that was previously subscribed to the
subscription event.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
Original function that was passed into the subscribe event,
that is to be unregistered.
/
