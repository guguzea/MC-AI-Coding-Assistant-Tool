> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.585Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# World (class)

```ts
export class World {
```

A class that wraps the state of a world - a set of
dimensions and the environment of Minecraft.

## Members（36）

### `private`
```ts
private constructor();
```

### `afterEvents`
```ts
readonly afterEvents: WorldAfterEvents;
```

@remarks
Contains a set of events that are applicable to the entirety
of the world.  Event callbacks are called in a deferred
manner. Event callbacks are executed in read-write mode.

This property can be read in early-execution mode.

/

### `beforeEvents`
```ts
readonly beforeEvents: WorldBeforeEvents;
```

@remarks
Contains a set of events that are applicable to the entirety
of the world. Event callbacks are called immediately. Event
callbacks are executed in read-only mode.

This property can be read in early-execution mode.

@example customCommand.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function customCommand(targetLocation: DimensionLocation) {
  const chatCallback = world.beforeEvents.chatSend.subscribe(eventData => {
    if (eventData.message.includes('cancel')) {
      // Cancel event if the message contains "cancel"
      eventData.cancel = true;
    } else {
      const args = eventData.message.split(' ');

      if (args.length > 0) {
        switch (args[0].toLowerCase()) {
          case 'echo':
            // Send a modified version of chat message
            world.sendMessage(`Echo '${eventData.message.substring(4).trim()}'`);
            break;
          case 'help':
            world.sendMessage(`Available commands: echo <message>`);
            break;
        }
      }
    }
  });
}
```
/

### `gameRules`
```ts
readonly gameRules: GameRules;
readonly isHardcore: boolean;
```

@remarks
The game rules that apply to the world.

/

### `primitiveShapesManager`
```ts
readonly primitiveShapesManager: PrimitiveShapesManager;
```

@remarks
Manager for adding and removing primitive text objects in
the world.

/

### `scoreboard`
```ts
readonly scoreboard: Scoreboard;
```

@remarks
Returns the general global scoreboard that applies to the
world.

/

### `seed`
```ts
readonly seed: string;
```

@remarks
The world seed.

/

### `structureManager`
```ts
readonly structureManager: StructureManager;
```

@remarks
Returns the manager for {@link Structure} related APIs.

/

### `tickingAreaManager`
```ts
readonly tickingAreaManager: TickingAreaManager;
```

@remarks
Manager for adding, removing and querying pack specific
ticking areas.

/

### `clearDynamicProperties`
```ts
clearDynamicProperties(): void;
```

@remarks
Clears the set of dynamic properties declared for this
behavior pack within the world.

/

### `getAbsoluteTime`
```ts
getAbsoluteTime(): number;
```

@remarks
Returns the absolute time since the start of the world.

/

### `getAimAssist`
```ts
getAimAssist(): AimAssistRegistry;
```

@remarks
The aim-assist presets and categories that can be used in
the world.

/

### `getAllPlayers`
```ts
getAllPlayers(): Player[];
```

@remarks
Returns an array of all active players within the world.

@throws This function can throw errors.

{@link CommandError}

{@link minecraftcommon.InvalidArgumentError}
/

### `getDay`
```ts
getDay(): number;
```

@remarks
Returns the current day.

@returns
The current day, determined by the world time divided by the
number of ticks per day. New worlds start at day 0.
/

### `getDefaultSpawnLocation`
```ts
getDefaultSpawnLocation(): Vector3;
```

@remarks
Returns the default Overworld spawn location.

@returns
The default Overworld spawn location. By default, the Y
coordinate is 32767, indicating a player's spawn height is
not fixed and will be determined by surrounding blocks.
/

### `getDifficulty`
```ts
getDifficulty(): Difficulty;
```

@remarks
Gets the difficulty from the world.

@returns
Returns the world difficulty.
/

### `getDimension`
```ts
getDimension(dimensionId: string): Dimension;
```

@remarks
Returns a dimension object.

@param dimensionId
The name of the dimension. For example, "overworld",
"nether" or "the_end".
@returns
The requested dimension
@throws
Throws if the given dimension name is invalid
/

### `getDynamicProperty`
```ts
getDynamicProperty(identifier: string): boolean | number | string | Vector3 | undefined;
```

@remarks
Returns a property value.

@param identifier
The property identifier.
@returns
Returns the value for the property, or undefined if the
property has not been set.
@throws
Throws if the given dynamic property identifier is not
defined.
@example incrementDynamicProperty.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function incrementDynamicProperty(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  let number = world.getDynamicProperty('samplelibrary:number');

  log('Current value is: ' + number);

  if (number === undefined) {
    number = 0;
  }

  if (typeof number !== 'number') {
    log('Number is of an unexpected type.');
    return -1;
  }

  world.setDynamicProperty('samplelibrary:number', number + 1);
}
```
@example incrementDynamicPropertyInJsonBlob.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function incrementDynamicPropertyInJsonBlob(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  let paintStr = world.getDynamicProperty('samplelibrary:longerjson');
  let paint: { color: string; intensity: number } | undefined = undefined;

  log('Current value is: ' + paintStr);

  if (paintStr === undefined) {
    paint = {
      color: 'purple',
      intensity: 0,
    };
  } else {
    if (typeof paintStr !== 'string') {
      log('Paint is of an unexpected type.');
      return -1;
    }

    try {
      paint = JSON.parse(paintStr);
    } catch (e) {
      log('Error parsing serialized struct.');
      return -1;
    }
  }

  if (!paint) {
    log('Error parsing serialized struct.');
    return -1;
  }

  paint.intensity++;
  paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
  world.setDynamicProperty('samplelibrary:longerjson', paintStr);
}
```
/

### `getDynamicPropertyIds`
```ts
getDynamicPropertyIds(): string[];
```

@remarks
Gets a set of dynamic property identifiers that have been
set in this world.

@returns
A string array of active dynamic property identifiers.
/

### `getDynamicPropertyTotalByteCount`
```ts
getDynamicPropertyTotalByteCount(): number;
```

@remarks
Gets the total byte count of dynamic properties. This could
potentially be used for your own analytics to ensure you're
not storing gigantic sets of dynamic properties.

/

### `getEntity`
```ts
getEntity(id: string): Entity | undefined;
```

@remarks
Returns an entity based on the provided id.

@param id
The id of the entity.
@returns
The requested entity object.
@throws
Throws if the given entity id is invalid.
/

### `getLootTableManager`
```ts
getLootTableManager(): LootTableManager;
```

@remarks
Returns a manager capable of generating loot from an
assortment of sources.

@returns
A loot table manager with a variety of loot generation
methods.
/

### `getMoonPhase`
```ts
getMoonPhase(): MoonPhase;
```

@remarks
Returns the MoonPhase for the current time.

/

### `getPackSettings`
```ts
getPackSettings(): Record<string, boolean | number | string>;
```

@remarks
Returns a map of pack setting name and value pairs.

This function can be called in early-execution mode.

/

### `getPlayers`
```ts
getPlayers(options?: EntityQueryOptions): Player[];
```

@remarks
Returns a set of players based on a set of conditions
defined via the EntityQueryOptions set of filter criteria.

@param options
Additional options that can be used to filter the set of
players returned.
@returns
A player array.
@throws
Throws if the provided EntityQueryOptions are invalid.

{@link CommandError}

{@link minecraftcommon.InvalidArgumentError}
/

### `getTimeOfDay`
```ts
getTimeOfDay(): number;
```

@remarks
Returns the time of day.

@returns
The time of day, in ticks, between 0 and 24000.
/

### `playMusic`
```ts
playMusic(trackId: string, musicOptions?: MusicOptions): void;
```

@remarks
Plays a particular music track for all players.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link minecraftcommon.PropertyOutOfBoundsError}
@example playMusicAndSound.ts
```typescript
import { world, MusicOptions, WorldSoundOptions, PlayerSoundOptions, DimensionLocation } from '@minecraft/server';

function playMusicAndSound(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  const musicOptions: MusicOptions = {
    fade: 0.5,
    loop: true,
    volume: 1.0,
  };
  world.playMusic('music.menu', musicOptions);

  const worldSoundOptions: WorldSoundOptions = {
    pitch: 0.5,
    volume: 4.0,
  };
  world.playSound('ambient.weather.thunder', targetLocation, worldSoundOptions);

  const playerSoundOptions: PlayerSoundOptions = {
    pitch: 1.0,
    volume: 1.0,
  };

  players[0].playSound('bucket.fill_water', playerSoundOptions);
}
```
/

### `queueMusic`
```ts
queueMusic(trackId: string, musicOptions?: MusicOptions): void;
```

@remarks
Queues an additional music track for players. If a track is
not playing, a music track will play.

This function can't be called in restricted-execution mode.

@param trackId
Identifier of the music track to play.
@param musicOptions
Additional options for the music track.
@throws
An error will be thrown if volume is less than 0.0.
An error will be thrown if fade is less than 0.0.


{@link minecraftcommon.PropertyOutOfBoundsError}
/

### `sendMessage`
```ts
sendMessage(message: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Sends a message to all players.

@param message
The message to be displayed.
@throws
This method can throw if the provided {@link RawMessage} is
in an invalid format. For example, if an empty `name` string
is provided to `score`.
/

### `setAbsoluteTime`
```ts
setAbsoluteTime(absoluteTime: number): void;
```

@remarks
Sets the world time.

This function can't be called in restricted-execution mode.

@param absoluteTime
The world time, in ticks.
/

### `setDefaultSpawnLocation`
```ts
setDefaultSpawnLocation(spawnLocation: Vector3): void;
```

@remarks
Sets a default spawn location for all players.

This function can't be called in restricted-execution mode.

@param spawnLocation
Location of the spawn point. Note that this is assumed to be
within the overworld dimension.
@throws
Throws if the provided spawn location is out of bounds.

{@link Error}

{@link LocationOutOfWorldBoundariesError}
/

### `setDifficulty`
```ts
setDifficulty(difficulty: Difficulty): void;
```

@remarks
Sets the worlds difficulty.

This function can't be called in restricted-execution mode.

@param difficulty
The difficulty we want to set the world to.
/

### `setDynamicProperties`
```ts
setDynamicProperties(values: Record<string, boolean | number | string | Vector3 | undefined>): void;
```

@remarks
Sets multiple dynamic properties with specific values.

@param values
A Record of key value pairs of the dynamic properties to
set. If the data value is null, it will remove that property
instead.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}
/

### `setDynamicProperty`
```ts
setDynamicProperty(identifier: string, value?: boolean | number | string | Vector3): void;
```

@remarks
Sets a specified property to a value.

@param identifier
The property identifier.
@param value
Data value of the property to set. If the value is null, it
will remove the property instead.
@throws
Throws if the given dynamic property identifier is not
defined.

{@link minecraftcommon.ArgumentOutOfBoundsError}
@example incrementDynamicProperty.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function incrementDynamicProperty(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
  let number = world.getDynamicProperty('samplelibrary:number');

  log('Current value is: ' + number);

  if (number === undefined) {
    number = 0;
  }

  if (typeof number !== 'number') {
    log('Number is of an unexpected type.');
    return -1;
  }

  world.setDynamicProperty('samplelibrary:number', number + 1);
}
```
@example incrementDynamicPropertyInJsonBlob.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function incrementDynamicPropertyInJsonBlob(
  log: (message: string, status?: number) => void,
  targetLocation: DimensionLocation
) {
  let paintStr = world.getDynamicProperty('samplelibrary:longerjson');
  let paint: { color: string; intensity: number } | undefined = undefined;

  log('Current value is: ' + paintStr);

  if (paintStr === undefined) {
    paint = {
      color: 'purple',
      intensity: 0,
    };
  } else {
    if (typeof paintStr !== 'string') {
      log('Paint is of an unexpected type.');
      return -1;
    }

    try {
      paint = JSON.parse(paintStr);
    } catch (e) {
      log('Error parsing serialized struct.');
      return -1;
    }
  }

  if (!paint) {
    log('Error parsing serialized struct.');
    return -1;
  }

  paint.intensity++;
  paintStr = JSON.stringify(paint); // be very careful to ensure your serialized JSON str cannot exceed limits
  world.setDynamicProperty('samplelibrary:longerjson', paintStr);
}
```
/

### `setTimeOfDay`
```ts
setTimeOfDay(timeOfDay: number | TimeOfDay): void;
```

@remarks
Sets the time of day.

This function can't be called in restricted-execution mode.

@param timeOfDay
The time of day, in ticks, between 0 and 24000.
@throws
Throws if the provided time of day is not within the valid
range.
/

### `stopMusic`
```ts
stopMusic(): void;
```

@remarks
Stops any music tracks from playing.

This function can't be called in restricted-execution mode.

/
