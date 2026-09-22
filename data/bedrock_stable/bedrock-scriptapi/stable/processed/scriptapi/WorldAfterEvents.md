> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.586Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# WorldAfterEvents (class)

```ts
export class WorldAfterEvents {
```

Contains a set of events that are available across the scope
of the World.

## Members（58）

### `private`
```ts
private constructor();
```

### `blockContainerClosed`
```ts
readonly blockContainerClosed: BlockContainerClosedAfterEventSignal;
```

@remarks
This event fires when a block container is closed.

This property can be read in early-execution mode.

/

### `blockContainerOpened`
```ts
readonly blockContainerOpened: BlockContainerOpenedAfterEventSignal;
```

@remarks
This event fires when a block container is opened.

This property can be read in early-execution mode.

/

### `blockExplode`
```ts
readonly blockExplode: BlockExplodeAfterEventSignal;
```

@remarks
This event fires for each BlockLocation destroyed by an
explosion. It is fired after the blocks have already been
destroyed.

This property can be read in early-execution mode.

/

### `buttonPush`
```ts
readonly buttonPush: ButtonPushAfterEventSignal;
```

@remarks
This event fires when a button is pushed.

This property can be read in early-execution mode.

/

### `dataDrivenEntityTrigger`
```ts
readonly dataDrivenEntityTrigger: DataDrivenEntityTriggerAfterEventSignal;
```

@remarks
This event is fired when an entity event has been triggered
that will update the component definition state of an
entity.

This property can be read in early-execution mode.

/

### `effectAdd`
```ts
readonly effectAdd: EffectAddAfterEventSignal;
```

@remarks
This event fires when an effect, like poisoning, is added to
an entity.

This property can be read in early-execution mode.

/

### `entityContainerClosed`
```ts
readonly entityContainerClosed: EntityContainerClosedAfterEventSignal;
```

@remarks
This event fires when an entity container is closed.

This property can be read in early-execution mode.

/

### `entityContainerOpened`
```ts
readonly entityContainerOpened: EntityContainerOpenedAfterEventSignal;
```

@remarks
This event fires when an entity container is opened.

This property can be read in early-execution mode.

/

### `entityDie`
```ts
readonly entityDie: EntityDieAfterEventSignal;
```

@remarks
This event fires when an entity dies.

This property can be read in early-execution mode.

/

### `entityHeal`
```ts
readonly entityHeal: EntityHealAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `entityHealthChanged`
```ts
readonly entityHealthChanged: EntityHealthChangedAfterEventSignal;
```

@remarks
This event fires when entity health changes in any degree.

This property can be read in early-execution mode.

/

### `entityHitBlock`
```ts
readonly entityHitBlock: EntityHitBlockAfterEventSignal;
```

@remarks
This event fires when an entity hits (that is, melee
attacks) a block.

This property can be read in early-execution mode.

/

### `entityHitEntity`
```ts
readonly entityHitEntity: EntityHitEntityAfterEventSignal;
```

@remarks
This event fires when an entity hits (that is, melee
attacks) another entity.

This property can be read in early-execution mode.

/

### `entityHurt`
```ts
readonly entityHurt: EntityHurtAfterEventSignal;
```

@remarks
This event fires when an entity is hurt (takes damage).

This property can be read in early-execution mode.

/

### `entityItemDrop`
```ts
readonly entityItemDrop: EntityItemDropAfterEventSignal;
```

@remarks
This event fires when an entity drops items.

This property can be read in early-execution mode.

/

### `entityItemPickup`
```ts
readonly entityItemPickup: EntityItemPickupAfterEventSignal;
```

@remarks
This event fires when an entity picks up items.

This property can be read in early-execution mode.

/

### `entityLoad`
```ts
readonly entityLoad: EntityLoadAfterEventSignal;
```

@remarks
Fires when an entity is loaded.

This property can be read in early-execution mode.

/

### `entityRemove`
```ts
readonly entityRemove: EntityRemoveAfterEventSignal;
```

@remarks
Fires when an entity is removed (for example, potentially
unloaded, or removed after being killed).

This property can be read in early-execution mode.

/

### `entitySpawn`
```ts
readonly entitySpawn: EntitySpawnAfterEventSignal;
```

@remarks
This event fires when an entity is spawned.

This property can be read in early-execution mode.

/

### `entityUpgrade`
```ts
readonly entityUpgrade: EntityUpgradeAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `explosion`
```ts
readonly explosion: ExplosionAfterEventSignal;
```

@remarks
This event is fired after an explosion occurs.

This property can be read in early-execution mode.

/

### `gameRuleChange`
```ts
readonly gameRuleChange: GameRuleChangeAfterEventSignal;
```

@remarks
This event fires when a world.gameRules property has
changed.

This property can be read in early-execution mode.

/

### `itemCompleteUse`
```ts
readonly itemCompleteUse: ItemCompleteUseAfterEventSignal;
```

@remarks
This event fires when a chargeable item completes charging.

This property can be read in early-execution mode.

/

### `itemReleaseUse`
```ts
readonly itemReleaseUse: ItemReleaseUseAfterEventSignal;
```

@remarks
This event fires when a chargeable item is released from
charging.

This property can be read in early-execution mode.

/

### `itemStartUse`
```ts
readonly itemStartUse: ItemStartUseAfterEventSignal;
```

@remarks
This event fires when a chargeable item starts charging.

This property can be read in early-execution mode.

/

### `itemStartUseOn`
```ts
readonly itemStartUseOn: ItemStartUseOnAfterEventSignal;
```

@remarks
This event fires when a player successfully uses an item or
places a block by pressing the Use Item / Place Block
button. If multiple blocks are placed, this event will only
occur once at the beginning of the block placement. Note:
This event cannot be used with Hoe or Axe items.

This property can be read in early-execution mode.

/

### `itemStopUse`
```ts
readonly itemStopUse: ItemStopUseAfterEventSignal;
```

@remarks
This event fires when a chargeable item stops charging.

This property can be read in early-execution mode.

/

### `itemStopUseOn`
```ts
readonly itemStopUseOn: ItemStopUseOnAfterEventSignal;
```

@remarks
This event fires when a player releases the Use Item / Place
Block button after successfully using an item. Note: This
event cannot be used with Hoe or Axe items.

This property can be read in early-execution mode.

/

### `itemUse`
```ts
readonly itemUse: ItemUseAfterEventSignal;
```

@remarks
This event fires when an item is successfully used by a
player.

This property can be read in early-execution mode.

/

### `leverAction`
```ts
readonly leverAction: LeverActionAfterEventSignal;
```

@remarks
A lever has been pulled.

This property can be read in early-execution mode.

/

### `pistonActivate`
```ts
readonly pistonActivate: PistonActivateAfterEventSignal;
```

@remarks
This event fires when a piston expands or retracts.

This property can be read in early-execution mode.

/

### `playerBreakBlock`
```ts
readonly playerBreakBlock: PlayerBreakBlockAfterEventSignal;
```

@remarks
This event fires for a block that is broken by a player.

This property can be read in early-execution mode.

/

### `playerButtonInput`
```ts
readonly playerButtonInput: PlayerButtonInputAfterEventSignal;
```

@remarks
This event fires when an {@link InputButton} state is
changed.

This property can be read in early-execution mode.

/

### `playerCancelBreakingBlock`
```ts
readonly playerCancelBreakingBlock: PlayerCancelBreakingBlockAfterEventSignal;
```

@remarks
This event fires when a player cancels breaking a block.

This property can be read in early-execution mode.

/

### `playerDimensionChange`
```ts
readonly playerDimensionChange: PlayerDimensionChangeAfterEventSignal;
```

@remarks
Fires when a player moved to a different dimension.

This property can be read in early-execution mode.

/

### `playerEmote`
```ts
readonly playerEmote: PlayerEmoteAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `playerGameModeChange`
```ts
readonly playerGameModeChange: PlayerGameModeChangeAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `playerHotbarSelectedSlotChange`
```ts
readonly playerHotbarSelectedSlotChange: PlayerHotbarSelectedSlotChangeAfterEventSignal;
```

@remarks
This event fires when a player's selected slot changes.

This property can be read in early-execution mode.

/

### `playerInputModeChange`
```ts
readonly playerInputModeChange: PlayerInputModeChangeAfterEventSignal;
```

@remarks
This event fires when a player's {@link InputMode} changes.

This property can be read in early-execution mode.

/

### `playerInputPermissionCategoryChange`
```ts
readonly playerInputPermissionCategoryChange: PlayerInputPermissionCategoryChangeAfterEventSignal;
```

@remarks
This event fires when a players input permissions change.

This property can be read in early-execution mode.

/

### `playerInteractWithBlock`
```ts
readonly playerInteractWithBlock: PlayerInteractWithBlockAfterEventSignal;
```

@remarks
An event for when a player interacts with a block.

This property can be read in early-execution mode.

/

### `playerInteractWithEntity`
```ts
readonly playerInteractWithEntity: PlayerInteractWithEntityAfterEventSignal;
```

@remarks
This event fires when a player interacts with an entity.

This property can be read in early-execution mode.

/

### `playerInventoryItemChange`
```ts
readonly playerInventoryItemChange: PlayerInventoryItemChangeAfterEventSignal;
```

@remarks
This event fires when an item gets added or removed to the
player's inventory.

This property can be read in early-execution mode.

/

### `playerJoin`
```ts
readonly playerJoin: PlayerJoinAfterEventSignal;
```

@remarks
This event fires when a player joins a world.  See also
playerSpawn for another related event you can trap for when
a player is spawned the first time within a world.

This property can be read in early-execution mode.

/

### `playerLeave`
```ts
readonly playerLeave: PlayerLeaveAfterEventSignal;
```

@remarks
This event fires when a player leaves a world.

This property can be read in early-execution mode.

/

### `playerPlaceBlock`
```ts
readonly playerPlaceBlock: PlayerPlaceBlockAfterEventSignal;
```

@remarks
This event fires for a block that is placed by a player.

This property can be read in early-execution mode.

/

### `playerSpawn`
```ts
readonly playerSpawn: PlayerSpawnAfterEventSignal;
```

@remarks
This event fires when a player spawns or respawns. Note that
an additional flag within this event will tell you whether
the player is spawning right after join vs. a respawn.

This property can be read in early-execution mode.

/

### `playerStartBreakingBlock`
```ts
readonly playerStartBreakingBlock: PlayerStartBreakingBlockAfterEventSignal;
```

@remarks
This event fires when a player starts breaking a block.

This property can be read in early-execution mode.

/

### `playerSwingStart`
```ts
readonly playerSwingStart: PlayerSwingStartAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `pressurePlatePop`
```ts
readonly pressurePlatePop: PressurePlatePopAfterEventSignal;
```

@remarks
A pressure plate has popped back up (i.e., there are no
entities on the pressure plate.)

This property can be read in early-execution mode.

/

### `pressurePlatePush`
```ts
readonly pressurePlatePush: PressurePlatePushAfterEventSignal;
```

@remarks
A pressure plate has pushed (at least one entity has moved
onto a pressure plate.)

This property can be read in early-execution mode.

/

### `projectileHitBlock`
```ts
readonly projectileHitBlock: ProjectileHitBlockAfterEventSignal;
```

@remarks
This event fires when a projectile hits a block.

This property can be read in early-execution mode.

/

### `projectileHitEntity`
```ts
readonly projectileHitEntity: ProjectileHitEntityAfterEventSignal;
```

@remarks
This event fires when a projectile hits an entity.

This property can be read in early-execution mode.

/

### `targetBlockHit`
```ts
readonly targetBlockHit: TargetBlockHitAfterEventSignal;
```

@remarks
A target block was hit.

This property can be read in early-execution mode.

/

### `tripWireTrip`
```ts
readonly tripWireTrip: TripWireTripAfterEventSignal;
```

@remarks
A trip wire was tripped.

This property can be read in early-execution mode.

/

### `weatherChange`
```ts
readonly weatherChange: WeatherChangeAfterEventSignal;
```

@remarks
This event will be triggered when the weather changes within
Minecraft.

This property can be read in early-execution mode.

/

### `worldLoad`
```ts
readonly worldLoad: WorldLoadAfterEventSignal;
```

@remarks
This property can be read in early-execution mode.

/
