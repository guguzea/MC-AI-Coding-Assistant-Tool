> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.434Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PistonActivateAfterEventSignal (class)

```ts
export class PistonActivateAfterEventSignal {
```

Manages callbacks that are connected to piston activations.

## Members（3）

### `private`
```ts
private constructor();
```

### `subscribe`
```ts
subscribe(callback: (arg0: PistonActivateAfterEvent) => void): (arg0: PistonActivateAfterEvent) => void;
```

@remarks
This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@example pistonAfterEvent.ts
```typescript
import {
  world,
  system,
  BlockPermutation,
  BlockPistonState,
  PistonActivateAfterEvent,
  DimensionLocation,
} from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

function pistonAfterEvent(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // set up a couple of piston blocks
  const piston = targetLocation.dimension.getBlock(targetLocation);
  const button = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y + 1,
    z: targetLocation.z,
  });

  if (piston === undefined || button === undefined) {
    log('Could not find block at location.');
    return -1;
  }

  piston.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Piston).withState('facing_direction', 3));
  button.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.AcaciaButton).withState('facing_direction', 1));

  world.afterEvents.pistonActivate.subscribe((pistonEvent: PistonActivateAfterEvent) => {
    const eventLoc = pistonEvent.piston.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y && eventLoc.z === targetLocation.z) {
      log(
        'Piston event at ' +
          system.currentTick +
          (pistonEvent.piston.isMoving ? ' Moving' : '') +
          (pistonEvent.piston.state === BlockPistonState.Expanding ? ' Expanding' : '') +
          (pistonEvent.piston.state === BlockPistonState.Expanded ? ' Expanded' : '') +
          (pistonEvent.piston.state === BlockPistonState.Retracting ? ' Retracting' : '') +
          (pistonEvent.piston.state === BlockPistonState.Retracted ? ' Retracted' : '')
      );
    }
  });
}
```
/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: PistonActivateAfterEvent) => void): void;
```

@remarks
Removes a callback from being called when a piston expands
or retracts.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
