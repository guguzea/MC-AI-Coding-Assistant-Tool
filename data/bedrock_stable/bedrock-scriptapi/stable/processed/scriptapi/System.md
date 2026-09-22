> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.566Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# System (class)

```ts
export class System {
```

A class that provides system-level events and functions.

## Members（14）

### `private`
```ts
private constructor();
```

### `afterEvents`
```ts
readonly afterEvents: SystemAfterEvents;
```

@remarks
Returns a collection of after-events for system-level
operations.

This property can be read in early-execution mode.

/

### `beforeEvents`
```ts
readonly beforeEvents: SystemBeforeEvents;
```

@remarks
Returns a collection of before-events for system-level
operations.

This property can be read in early-execution mode.

/

### `currentTick`
```ts
readonly currentTick: number;
```

@remarks
Represents the current world tick of the server.

This property can be read in early-execution mode.

/

### `isEditorWorld`
```ts
readonly isEditorWorld: boolean;
```

@remarks
Returns true if this is a world where the editor is
currently loaded, returns false otherwise.

This property can be read in early-execution mode.

/

### `serverSystemInfo`
```ts
readonly serverSystemInfo: SystemInfo;
```

@remarks
Contains the device information for the server.

This property can be read in early-execution mode.

/

### `clearJob`
```ts
clearJob(jobId: number): void;
```

@remarks
Cancels the execution of a job queued via {@link
System.runJob}.

This function can be called in early-execution mode.

@param jobId
The job ID returned from {@link System.runJob}.
/

### `clearRun`
```ts
clearRun(runId: number): void;
```

@remarks
Cancels the execution of a function run that was previously
scheduled via {@link System.run}.

This function can be called in early-execution mode.

/

### `run`
```ts
run(callback: () => void): number;
```

@remarks
Runs a specified function at the next available future time.
This is frequently used to implement delayed behaviors and
game loops. When run within the context of an event handler,
this will generally run the code at the end of the same tick
where the event occurred. When run in other code (a
system.run callout), this will run the function in the next
tick. Note, however, that depending on load on the system,
running in the same or next tick is not guaranteed.

This function can be called in early-execution mode.

@param callback
Function callback to run at the next game tick.
@returns
An opaque identifier that can be used with the `clearRun`
function to cancel the execution of this run.
@example trapTick.ts
```typescript
import { world, system } from '@minecraft/server';

function trapTick() {
  try {
    // Minecraft runs at 20 ticks per second.
    if (system.currentTick % 1200 === 0) {
      world.sendMessage('Another minute passes...');
    }
  } catch (e) {
    console.warn('Error: ' + e);
  }

  system.run(trapTick);
}
```
/

### `runInterval`
```ts
runInterval(callback: () => void, tickInterval?: number): number;
```

@remarks
Runs a set of code on an interval.

This function can be called in early-execution mode.

@param callback
Functional code that will run when this interval occurs.
@param tickInterval
An interval of every N ticks that the callback will be
called upon.
@returns
An opaque handle that can be used with the clearRun method
to stop the run of this function on an interval.
@example every30Seconds.ts
```typescript
import { world, system, DimensionLocation } from '@minecraft/server';

function every30Seconds(targetLocation: DimensionLocation) {
  const intervalRunIdentifier = Math.floor(Math.random() * 10000);

  system.runInterval(() => {
    world.sendMessage('This is an interval run ' + intervalRunIdentifier + ' sending a message every 30 seconds.');
  }, 600);
}
```
/

### `runJob`
```ts
runJob(generator: Generator<void, void, void>): number;
```

@remarks
Queues a generator to run until completion.  The generator
will be given a time slice each tick, and will be run until
it yields or completes.

This function can be called in early-execution mode.

@param generator
The instance of the generator to run.
@returns
An opaque handle that can be used with {@link
System.clearJob} to stop the run of this generator.
@example cubeGenerator.ts
```typescript
import { system, BlockPermutation, DimensionLocation } from '@minecraft/server';

function cubeGenerator(targetLocation: DimensionLocation) {
  const blockPerm = BlockPermutation.resolve('minecraft:cobblestone');

  system.runJob(blockPlacingGenerator(blockPerm, targetLocation, 15));
}

function* blockPlacingGenerator(blockPerm: BlockPermutation, startingLocation: DimensionLocation, size: number) {
  for (let x = startingLocation.x; x < startingLocation.x + size; x++) {
    for (let y = startingLocation.y; y < startingLocation.y + size; y++) {
      for (let z = startingLocation.z; z < startingLocation.z + size; z++) {
        const block = startingLocation.dimension.getBlock({ x: x, y: y, z: z });
        if (block) {
          block.setPermutation(blockPerm);
        }
        yield;
      }
    }
  }
}
```
/

### `runTimeout`
```ts
runTimeout(callback: () => void, tickDelay?: number): number;
```

@remarks
Runs a set of code at a future time specified by tickDelay.

This function can be called in early-execution mode.

@param callback
Functional code that will run when this timeout occurs.
@param tickDelay
Amount of time, in ticks, before the interval will be
called.
@returns
An opaque handle that can be used with the clearRun method
to stop the run of this function on an interval.
/

### `sendScriptEvent`
```ts
sendScriptEvent(id: string, message: string): void;
```

@remarks
Causes an event to fire within script with the specified
message ID and payload.

@param id
Identifier of the message to send. This is custom and
dependent on the kinds of behavior packs and content you may
have installed within the world.
@param message
Data component of the message to send. This is custom and
dependent on the kinds of behavior packs and content you may
have installed within the world.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link NamespaceNameError}
/

### `waitTicks`
```ts
waitTicks(ticks: number): Promise<void>;
```

@remarks
waitTicks returns a promise that resolves after the
requested number of ticks.

This function can be called in early-execution mode.

@param ticks
The amount of ticks to wait. Minimum value is 1.
@returns
A promise that is resolved when the specified amount of
ticks have occurred.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}
/
