> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.184Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ButtonPushAfterEventSignal (class)

```ts
export class ButtonPushAfterEventSignal {
```

Manages callbacks that are connected to when a button is
pushed.
@example buttonPushEvent.ts
```typescript
import { world, system, BlockPermutation, ButtonPushAfterEvent, DimensionLocation } from '@minecraft/server';
import { MinecraftBlockTypes } from '@minecraft/vanilla-data';

function buttonPushEvent(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  // set up a button on cobblestone
  const cobblestone = targetLocation.dimension.getBlock(targetLocation);
  const button = targetLocation.dimension.getBlock({
    x: targetLocation.x,
    y: targetLocation.y + 1,
    z: targetLocation.z,
  });

  if (cobblestone === undefined || button === undefined) {
    log('Could not find block at location.');
    return -1;
  }

  cobblestone.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.Cobblestone));
  button.setPermutation(BlockPermutation.resolve(MinecraftBlockTypes.AcaciaButton).withState('facing_direction', 1));

  world.afterEvents.buttonPush.subscribe((buttonPushEvent: ButtonPushAfterEvent) => {
    const eventLoc = buttonPushEvent.block.location;

    if (eventLoc.x === targetLocation.x && eventLoc.y === targetLocation.y + 1 && eventLoc.z === targetLocation.z) {
      log('Button push event at tick ' + system.currentTick);
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
subscribe(callback: (arg0: ButtonPushAfterEvent) => void): (arg0: ButtonPushAfterEvent) => void;
```

@remarks
Adds a callback that will be called when a button is pushed.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/

### `unsubscribe`
```ts
unsubscribe(callback: (arg0: ButtonPushAfterEvent) => void): void;
```

@remarks
Removes a callback from being called when a button is
pushed.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

/
