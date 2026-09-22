> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.597Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockCustomComponent (interface)

```ts
export interface BlockCustomComponent {
```

Contains a set of events that will be raised for a block.
This object must be bound using the BlockRegistry.

## Members（11）

### `beforeOnPlayerPlace`
```ts
beforeOnPlayerPlace?: (arg0: BlockComponentPlayerPlaceBeforeEvent, arg1: CustomComponentParameters) => void;
onBlockStateChange?: (arg0: BlockComponentBlockStateChangeEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called before a player places the
block.

/

### `onBreak`
```ts
onBreak?: (arg0: BlockComponentBlockBreakEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when a specific block is
destroyed.
Changes in block permutations will not trigger this event.
Fill Command and SetBlock Command can trigger this event
when changing a block permutation only when using destroy
mode.
Custom blocks with the "minecraft:replaceable" component
will not trigger the event when replaced.

/

### `onEntity`
```ts
onEntity?: (arg0: BlockComponentEntityEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an entity fires an event
to this block in the world.

/

### `onEntityFallOn`
```ts
onEntityFallOn?: (arg0: BlockComponentEntityFallOnEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an entity falls onto the
block that this custom component is bound to.

/

### `onPlace`
```ts
onPlace?: (arg0: BlockComponentOnPlaceEvent, arg1: CustomComponentParameters) => void;
onPlayerBreak?: (arg0: BlockComponentPlayerBreakEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when the block that this custom
component is bound to is placed.

/

### `onPlayerInteract`
```ts
onPlayerInteract?: (arg0: BlockComponentPlayerInteractEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when a player sucessfully
interacts with the block that this custom component is bound
to.

/

### `onRandomTick`
```ts
onRandomTick?: (arg0: BlockComponentRandomTickEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when a block randomly ticks.

/

### `onRedstoneUpdate`
```ts
onRedstoneUpdate?: (arg0: BlockComponentRedstoneUpdateEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an 'onRedstoneUpdate'
engine event occurs if the block has a
`minecraft:redstone_consumer` component and the redstone
signal strength is >= to the components `min_power` field.

/

### `onStepOff`
```ts
onStepOff?: (arg0: BlockComponentStepOffEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an entity steps off the
block that this custom component is bound to.

/

### `onStepOn`
```ts
onStepOn?: (arg0: BlockComponentStepOnEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when an entity steps onto the
block that this custom component is bound to.

/

### `onTick`
```ts
onTick?: (arg0: BlockComponentTickEvent, arg1: CustomComponentParameters) => void;
```

@remarks
This function will be called when a block ticks.

/
