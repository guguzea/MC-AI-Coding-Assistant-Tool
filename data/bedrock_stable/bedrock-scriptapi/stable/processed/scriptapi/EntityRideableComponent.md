> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.322Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityRideableComponent (class)

```ts
export class EntityRideableComponent extends EntityComponent {
```

## Members（14）

### `private`
```ts
private constructor();
```

### `controllingSeat`
```ts
readonly controllingSeat: number;
```

@remarks
Zero-based index of the seat that can used to control this
entity.

@throws This property can throw when used.
/

### `crouchingSkipInteract`
```ts
readonly crouchingSkipInteract: boolean;
```

@remarks
Determines whether interactions are not supported if the
entity is crouching.

@throws This property can throw when used.
/

### `interactText`
```ts
readonly interactText: string;
```

@remarks
Set of text that should be displayed when a player is
looking to ride on this entity (commonly with touch-screen
controls).

@throws This property can throw when used.
/

### `passengerMaxWidth`
```ts
readonly passengerMaxWidth: number;
```

@remarks
The max width a mob can be to be a passenger.

@throws This property can throw when used.
/

### `pullInEntities`
```ts
readonly pullInEntities: boolean;
```

@remarks
If true, this entity will pull in entities that are in the
correct family_types into any available seat.

@throws This property can throw when used.
/

### `riderCanInteract`
```ts
readonly riderCanInteract: boolean;
```

@remarks
If true, this entity will be picked when looked at by the
rider.

@throws This property can throw when used.
/

### `seatCount`
```ts
readonly seatCount: number;
static readonly componentId = 'minecraft:rideable';
```

@remarks
Number of seats for riders defined for this entity.

@throws This property can throw when used.
/

### `addRider`
```ts
addRider(rider: Entity): boolean;
```

@remarks
Adds an entity to this entity as a rider.

This function can't be called in restricted-execution mode.

@param rider
Entity that will become the rider of this entity.
@returns
True if the rider entity was successfully added.
@throws This function can throw errors.
@example minibiomes.ts
```typescript
import { EntityComponentTypes } from '@minecraft/server';
import { Test, register } from '@minecraft/server-gametest';
import { MinecraftBlockTypes, MinecraftEntityTypes } from '@minecraft/vanilla-data';

function minibiomes(test: Test) {
  const minecart = test.spawn(MinecraftEntityTypes.Minecart, { x: 9, y: 7, z: 7 });
  const pig = test.spawn(MinecraftEntityTypes.Pig, { x: 9, y: 7, z: 7 });

  test.setBlockType(MinecraftBlockTypes.Cobblestone, { x: 10, y: 7, z: 7 });

  const minecartRideableComp = minecart.getComponent(EntityComponentTypes.Rideable);

  minecartRideableComp?.addRider(pig);

  test.succeedWhenEntityPresent(MinecraftEntityTypes.Pig, { x: 8, y: 3, z: 1 }, true);
}
register('ChallengeTests', 'minibiomes', minibiomes).structureName('gametests:minibiomes').maxTicks(160);
```
/

### `ejectRider`
```ts
ejectRider(rider: Entity): void;
```

@remarks
Ejects the specified rider of this entity.

This function can't be called in restricted-execution mode.

@param rider
Entity that should be ejected from this entity.
@throws This function can throw errors.
/

### `ejectRiders`
```ts
ejectRiders(): void;
```

@remarks
Ejects all riders of this entity.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `getFamilyTypes`
```ts
getFamilyTypes(): string[];
```

@remarks
A string-list of entity types that this entity can support
as riders.

@throws This function can throw errors.
/

### `getRiders`
```ts
getRiders(): Entity[];
```

@remarks
Gets a list of the all the entities currently riding this
entity.

@throws This function can throw errors.
/

### `getSeats`
```ts
getSeats(): Seat[];
```

@remarks
Gets a list of positions and number of riders for each
position for entities riding this entity.

@throws This function can throw errors.
/
