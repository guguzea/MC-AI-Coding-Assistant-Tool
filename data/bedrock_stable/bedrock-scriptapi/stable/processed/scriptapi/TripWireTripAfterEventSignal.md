> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.579Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TripWireTripAfterEventSignal (class)

```ts
export class TripWireTripAfterEventSignal {
```

Manages callbacks that are connected to when a trip wire is
tripped.
@example tripWireTripEvent.ts
```typescript
import { world, system, BlockPermutation, TripWireTripAfterEvent, DimensionLocation } from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

function tripWireTripEvent(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // set up a tripwire
  const redstone = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y - 1,
    z: targetLocation.z,
  });
  const tripwire = targetLocation.dimension.getBlock(targetLocation);

  if (redstone === undefined || tripwire === undefined) {
    log('Could not find block at location.');
    return -1;
  }

  redstone.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.RedstoneBlock));
  tripwire.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.TripWire));

  world.afterEvents.tripWireTrip.subscribe((tripWireTripEvent: TripWireTripAfterEvent) => {
    const eventLoc = tripWireTripEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        'Tripwire trip event at tick ' +
          system.currentTick +
          (tripWireTripEvent.sources.length > 0 ? ' by entity ' + tripWireTripEvent.sources[0].id : '')
      );
    }
  });
}
```

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(callback: (arg0: TripWireTripAfterEvent) => void): (arg0: TripWireTripAfterEvent) => void;
```

@remarks
Adds a callback that will be called when a trip wire is
tripped.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: TripWireTripAfterEvent) => void): void;
```

@remarks
Removes a callback from being called when a trip wire is
tripped.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
