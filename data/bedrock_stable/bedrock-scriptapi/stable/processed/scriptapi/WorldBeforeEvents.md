> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.587Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# WorldBeforeEvents (class)

```ts
export class WorldBeforeEvents {
```

A set of events that fire before an actual action occurs. In
most cases, you can potentially cancel or modify the
impending event. Note that in before events any APIs that
modify gameplay state will not function and will throw an
error. (e.g., dimension.spawnEntity)

## Members（14）

### `private`
```ts
private constructor();
```

### `effectAdd`
```ts
readonly effectAdd: EffectAddBeforeEventSignal;
```

@remarks
This event is triggered after an event has been added to an
entity.

This property can be read in early-execution mode.

/

### `entityHeal`
```ts
readonly entityHeal: EntityHealBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `entityHurt`
```ts
readonly entityHurt: EntityHurtBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `entityItemPickup`
```ts
readonly entityItemPickup: EntityItemPickupBeforeEventSignal;
```

@remarks
This event fires before an entity picks up an item.

This property can be read in early-execution mode.

/

### `entityRemove`
```ts
readonly entityRemove: EntityRemoveBeforeEventSignal;
```

@remarks
Fires before an entity is removed from the world (for
example, unloaded or removed after being killed.)

This property can be read in early-execution mode.

/

### `explosion`
```ts
readonly explosion: ExplosionBeforeEventSignal;
```

@remarks
This event is fired after an explosion occurs.

This property can be read in early-execution mode.

/

### `itemUse`
```ts
readonly itemUse: ItemUseBeforeEventSignal;
```

@remarks
This event fires when an item is successfully used by a
player.

This property can be read in early-execution mode.

/

### `playerBreakBlock`
```ts
readonly playerBreakBlock: PlayerBreakBlockBeforeEventSignal;
```

@remarks
This event fires before a block is broken by a player.

This property can be read in early-execution mode.

/

### `playerGameModeChange`
```ts
readonly playerGameModeChange: PlayerGameModeChangeBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/

### `playerInteractWithBlock`
```ts
readonly playerInteractWithBlock: PlayerInteractWithBlockBeforeEventSignal;
```

@remarks
Fires before a player interacts with a block.

This property can be read in early-execution mode.

/

### `playerInteractWithEntity`
```ts
readonly playerInteractWithEntity: PlayerInteractWithEntityBeforeEventSignal;
```

@remarks
Fires before a player interacts with an entity.

This property can be read in early-execution mode.

/

### `playerLeave`
```ts
readonly playerLeave: PlayerLeaveBeforeEventSignal;
```

@remarks
Fires when a player leaves the game.

This property can be read in early-execution mode.

/

### `weatherChange`
```ts
readonly weatherChange: WeatherChangeBeforeEventSignal;
```

@remarks
This property can be read in early-execution mode.

/
