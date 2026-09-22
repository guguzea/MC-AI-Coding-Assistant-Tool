> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.435Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Player (class)

```ts
export class Player extends Entity {
```

## Members（41）

### `private`
```ts
private constructor();
```

### `camera`
```ts
readonly camera: Camera;
```

@remarks
The player's Camera.

@throws This property can throw when used.
/

### `clientSystemInfo`
```ts
readonly clientSystemInfo: ClientSystemInfo;
```

@remarks
Contains the player's device information.

@throws This property can throw when used.
/

### `commandPermissionLevel`
```ts
commandPermissionLevel: CommandPermissionLevel;
```

@remarks
This property can't be edited in restricted-execution mode.

/

### `graphicsMode`
```ts
readonly graphicsMode: GraphicsMode;
```

@remarks
Gets the current graphics mode of the player's client. This
can be changed in the Video section of the settings menu
based on what hardware is available.

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `inputInfo`
```ts
readonly inputInfo: InputInfo;
```

@remarks
Contains the player's input information.

/

### `inputPermissions`
```ts
readonly inputPermissions: PlayerInputPermissions;
```

@remarks
Input permissions of the player.

/

### `isEmoting`
```ts
readonly isEmoting: boolean;
```

@remarks
If true, the player is currently emoting.

@throws This property can throw when used.
/

### `isFlying`
```ts
readonly isFlying: boolean;
```

@remarks
Whether the player is flying. For example, in Creative or
Spectator mode.

@throws This property can throw when used.
/

### `isGliding`
```ts
readonly isGliding: boolean;
```

@remarks
Whether the player is gliding with Elytra.

@throws This property can throw when used.
/

### `isJumping`
```ts
readonly isJumping: boolean;
```

@remarks
Whether the player is jumping. This will remain true while
the player is holding the jump action.

@throws This property can throw when used.
/

### `level`
```ts
readonly level: number;
```

@remarks
The current overall level for the player, based on their
experience.

@throws This property can throw when used.
/

### `locatorBar`
```ts
readonly locatorBar: LocatorBar;
```

@remarks
The player's Locator Bar. This property is used for managing
waypoints displayed on the HUD.

/

### `name`
```ts
readonly name: string;
```

@remarks
Name of the player.

@throws This property can throw when used.
/

### `onScreenDisplay`
```ts
readonly onScreenDisplay: ScreenDisplay;
```

@remarks
Contains methods for manipulating the on-screen display of a
Player.

@throws This property can throw when used.
/

### `playerPermissionLevel`
```ts
readonly playerPermissionLevel: PlayerPermissionLevel;
```

@throws This property can throw when used.

{@link InvalidEntityError}
/

### `selectedSlotIndex`
```ts
selectedSlotIndex: number;
```

@remarks
This property can't be edited in restricted-execution mode.

/

### `totalXpNeededForNextLevel`
```ts
readonly totalXpNeededForNextLevel: number;
```

@remarks
The overall total set of experience needed to achieve the
next level for a player.

@throws This property can throw when used.
/

### `xpEarnedAtCurrentLevel`
```ts
readonly xpEarnedAtCurrentLevel: number;
```

@remarks
The current set of experience achieved for the player.

@throws This property can throw when used.
/

### `addExperience`
```ts
addExperience(amount: number): number;
```

@remarks
Adds/removes experience to/from the Player and returns the
current experience of the Player.

This function can't be called in restricted-execution mode.

@param amount
Amount of experience to add. Note that this can be negative.
Min/max bounds at -2^24 ~ 2^24
Bounds: [-16777216, 16777216]
@returns
Returns the current experience of the Player.
@throws This function can throw errors.
/

### `addLevels`
```ts
addLevels(amount: number): number;
```

@remarks
Adds/removes level to/from the Player and returns the
current level of the Player.

This function can't be called in restricted-execution mode.

@param amount
Amount to add to the player. Min/max bounds at -2^24 ~ 2^24
Bounds: [-16777216, 16777216]
@returns
Returns the current level of the Player.
@throws This function can throw errors.
/

### `clearPropertyOverridesForEntity`
```ts
clearPropertyOverridesForEntity(targetEntity: Entity | string): void;
```

@remarks
For this player, removes all overrides of any Entity
Properties on the target Entity. This change is not applied
until the next tick and will not apply to other players.

This function can't be called in restricted-execution mode.

@param targetEntity
The Entity or the ID of the Entity whose Entity Property
overrides are being cleared.
@throws
Throws if the Entity or Entity ID is invalid.
/

### `getAimAssist`
```ts
getAimAssist(): PlayerAimAssist;
```

@remarks
The player's aim-assist settings.

/

### `getControlScheme`
```ts
getControlScheme(): ControlScheme;
```

@remarks
Returns the player's current control scheme.

@throws This function can throw errors.

{@link InvalidEntityError}
/

### `getGameMode`
```ts
getGameMode(): GameMode;
```

@remarks
Retrieves the active gamemode for this player, if specified.

@throws This function can throw errors.
/

### `getItemCooldown`
```ts
getItemCooldown(cooldownCategory: string): number;
```

@remarks
Gets the current item cooldown time for a particular
cooldown category.

@param cooldownCategory
Specifies the cooldown category to retrieve the current
cooldown for.
@throws This function can throw errors.
/

### `getSpawnPoint`
```ts
getSpawnPoint(): DimensionLocation | undefined;
```

@remarks
Gets the current spawn point of the player.

@throws This function can throw errors.
/

### `getTotalXp`
```ts
getTotalXp(): number;
```

@remarks
 Gets the total experience of the Player.

@throws This function can throw errors.
/

### `playMusic`
```ts
playMusic(trackId: string, musicOptions?: MusicOptions): void;
```

@remarks
Plays a music track that only this particular player can
hear.

This function can't be called in restricted-execution mode.

@param trackId
Identifier of the music track to play.
@param musicOptions
Additional options for the music track.
@throws This function can throw errors.
/

### `playSound`
```ts
playSound(soundId: string, soundOptions?: PlayerSoundOptions): SoundInstance;
```

@remarks
Plays a sound that only this particular player can hear.

This function can't be called in restricted-execution mode.

@param soundOptions
Additional optional options for the sound.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link Error}
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
Queues an additional music track that only this particular
player can hear. If a track is not playing, a music track
will play.

This function can't be called in restricted-execution mode.

@param trackId
Identifier of the music track to play.
@param musicOptions
Additional options for the music track.
@throws
An error will be thrown if volume is less than 0.0.
An error will be thrown if fade is less than 0.0.

/

### `removePropertyOverrideForEntity`
```ts
removePropertyOverrideForEntity(targetEntity: Entity, identifier: string): void;
```

@remarks
For this player, removes the override on an Entity Property.
This change is not applied until the next tick and will not
apply to other players.

This function can't be called in restricted-execution mode.

@param targetEntity
The Entity whose Entity Property override is being removed.
@param identifier
The Entity Property identifier.
@throws
Throws if the entity is invalid.
Throws if an invalid identifier is provided.
Throws if the provided value type does not match the
property type.
/

### `resetLevel`
```ts
resetLevel(): void;
```

@remarks
Resets the level of the player.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `sendMessage`
```ts
sendMessage(message: (RawMessage | string)[] | RawMessage | string): void;
```

@remarks
Sends a message to the player.

@param message
The message to be displayed.
@throws
This method can throw if the provided {@link RawMessage} is
in an invalid format. For example, if an empty `name` string
is provided to `score`.

{@link InvalidEntityError}

{@link RawMessageError}
@example nestedTranslation.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function nestedTranslation(targetLocation: DimensionLocation) {
  // Displays "Apple or Coal"
  const rawMessage = {
    translate: 'accessibility.list.or.two',
    with: { rawtext: [{ translate: 'item.apple.name' }, { translate: 'item.coal.name' }] },
  };
  world.sendMessage(rawMessage);
}
```
@example scoreWildcard.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function scoreWildcard(targetLocation: DimensionLocation) {
  // Displays the player's score for objective "obj". Each player will see their own score.
  const rawMessage = { score: { name: '*', objective: 'obj' } };
  world.sendMessage(rawMessage);
}
```
@example sendBasicMessage.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function sendBasicMessage(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].sendMessage('Hello World!');
}
```
@example sendPlayerMessages.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function sendPlayerMessages(targetLocation: DimensionLocation) {
  for (const player of world.getAllPlayers()) {
    // Displays "First or Second"
    const rawMessage = { translate: 'accessibility.list.or.two', with: ['First', 'Second'] };
    player.sendMessage(rawMessage);

    // Displays "Hello, world!"
    player.sendMessage('Hello, world!');

    // Displays "Welcome, Amazing Player 1!"
    player.sendMessage({ translate: 'authentication.welcome', with: ['Amazing Player 1'] });

    // Displays the player's score for objective "obj". Each player will see their own score.
    const rawMessageWithScore = { score: { name: '*', objective: 'obj' } };
    player.sendMessage(rawMessageWithScore);

    // Displays "Apple or Coal"
    const rawMessageWithNestedTranslations = {
      translate: 'accessibility.list.or.two',
      with: { rawtext: [{ translate: 'item.apple.name' }, { translate: 'item.coal.name' }] },
    };
    player.sendMessage(rawMessageWithNestedTranslations);
  }
}
```
@example sendTranslatedMessage.ts
```typescript
import { world, DimensionLocation } from '@minecraft/server';

function sendTranslatedMessage(targetLocation: DimensionLocation) {
  const players = world.getPlayers();

  players[0].sendMessage({ translate: 'authentication.welcome', with: ['Amazing Player 1'] });
}
```
/

### `setControlScheme`
```ts
setControlScheme(controlScheme?: ControlScheme): void;
```

@remarks
Set a player's control scheme. The player's active camera
preset must be set by scripts like with camera.setCamera()
or commands.

This function can't be called in restricted-execution mode.

@param controlScheme
Control scheme type. If this argument is undefined, this
method will clear the player's control scheme back to the
player camera's default control scheme.
@returns
Returns nothing if the control scheme was added or updated
successfully. This can throw an InvalidArgumentError if the
control scheme is not allowed by the player's current
camera.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}
/

### `setGameMode`
```ts
setGameMode(gameMode?: GameMode): void;
```

@remarks
Sets a gamemode override for this player.

This function can't be called in restricted-execution mode.

@param gameMode
Active gamemode.
@throws This function can throw errors.
/

### `setPropertyOverrideForEntity`
```ts
setPropertyOverrideForEntity(targetEntity: Entity, identifier: string, value: boolean | number | string): void;
```

@remarks
For this player, overrides an Entity Property on the target
Entity to the provided value. This property must be client
synced. This change is not applied until the next tick and
will not apply to other players.

This function can't be called in restricted-execution mode.

@param targetEntity
The Entity whose Entity Property is being overriden.
@param identifier
The Entity Property identifier.
@param value
The override value. The provided type must be compatible
with the type specified in the entity's definition.
@throws
Throws if the entity is invalid.
Throws if an invalid identifier is provided.
Throws if the provided value type does not match the
property type.
Throws if the provided value is outside the expected range
(int, float properties).
Throws if the provided string value does not match the set
of accepted enum values (enum properties)
/

### `setSpawnPoint`
```ts
setSpawnPoint(spawnPoint?: DimensionLocation): void;
```

@remarks
Sets the current starting spawn point for this particular
player.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.

{@link Error}

{@link LocationOutOfWorldBoundariesError}
/

### `spawnParticle`
```ts
spawnParticle(effectName: string, location: Vector3, molangVariables?: MolangVariableMap): void;
```

@remarks
Creates a new particle emitter at a specified location in
the world. Only visible to the target player.

This function can't be called in restricted-execution mode.

@param effectName
Identifier of the particle to create.
@param location
The location at which to create the particle emitter.
@param molangVariables
A set of optional, customizable variables that can be
adjusted for this particle.
@throws This function can throw errors.

{@link Error}

{@link LocationInUnloadedChunkError}

{@link LocationOutOfWorldBoundariesError}
@example spawnParticle.ts
```typescript
import { world, MolangVariableMap, Vector3 } from '@minecraft/server';

world.afterEvents.playerSpawn.subscribe(event => {
  const targetLocation = event.player.location;
  for (let i = 0; i < 100; i++) {
    const molang = new MolangVariableMap();

    molang.setColorRGB('variable.color', {
      red: Math.random(),
      green: Math.random(),
      blue: Math.random(),
    });

    const newLocation: Vector3 = {
      x: targetLocation.x + Math.floor(Math.random() * 8) - 4,
      y: targetLocation.y + Math.floor(Math.random() * 8) - 4,
      z: targetLocation.z + Math.floor(Math.random() * 8) - 4,
    };
    event.player.spawnParticle('minecraft:colored_flame_particle', newLocation, molang);
  }
});
```
/

### `startItemCooldown`
```ts
startItemCooldown(cooldownCategory: string, tickDuration: number): void;
```

@remarks
Sets the item cooldown time for a particular cooldown
category.

This function can't be called in restricted-execution mode.

@param cooldownCategory
Specifies the cooldown category to retrieve the current
cooldown for.
@param tickDuration
Duration in ticks of the item cooldown.
Bounds: [0, 32767]
@throws This function can throw errors.
/

### `stopMusic`
```ts
stopMusic(): void;
```

@remarks
Stops any music tracks from playing for this particular
player.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/
