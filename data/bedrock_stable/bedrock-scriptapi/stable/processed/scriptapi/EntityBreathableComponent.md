> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.222Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityBreathableComponent (class)

```ts
export class EntityBreathableComponent extends EntityComponent {
```

## Members（11）

### `private`
```ts
private constructor();
```

### `breathesAir`
```ts
readonly breathesAir: boolean;
```

@remarks
If true, this entity can breathe in air.

@throws This property can throw when used.
/

### `breathesLava`
```ts
readonly breathesLava: boolean;
```

@remarks
If true, this entity can breathe in lava.

@throws This property can throw when used.
/

### `breathesSolids`
```ts
readonly breathesSolids: boolean;
```

@remarks
If true, this entity can breathe in solid blocks.

@throws This property can throw when used.
/

### `breathesWater`
```ts
readonly breathesWater: boolean;
```

@remarks
If true, this entity can breathe in water.

@throws This property can throw when used.
/

### `generatesBubbles`
```ts
readonly generatesBubbles: boolean;
```

@remarks
If true, this entity will have visible bubbles while in
water.

@throws This property can throw when used.
/

### `inhaleTime`
```ts
readonly inhaleTime: number;
```

@remarks
Time in seconds to recover breath to maximum.

@throws This property can throw when used.
/

### `suffocateTime`
```ts
readonly suffocateTime: number;
```

@remarks
Time in seconds between suffocation damage.

@throws This property can throw when used.
/

### `totalSupply`
```ts
readonly totalSupply: number;
static readonly componentId = 'minecraft:breathable';
```

@remarks
Time in seconds the entity can hold its breath.

@throws This property can throw when used.
/

### `getBreatheBlocks`
```ts
getBreatheBlocks(): BlockPermutation[];
```

@remarks
List of blocks this entity can breathe in, in addition to
the separate properties for classes of blocks.

@throws This function can throw errors.
/

### `getNonBreatheBlocks`
```ts
getNonBreatheBlocks(): BlockPermutation[];
```

@remarks
List of blocks this entity can't breathe in.

@throws This function can throw errors.
/
