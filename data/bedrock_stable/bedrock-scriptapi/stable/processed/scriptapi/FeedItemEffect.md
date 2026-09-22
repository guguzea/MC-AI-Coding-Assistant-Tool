> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.346Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# FeedItemEffect (class)

```ts
export class FeedItemEffect {
```

Represents an effect that is applied as a result of a food
item being fed to an entity.

## Members（5）

### `private`
```ts
private constructor();
```

### `amplifier`
```ts
readonly amplifier: number;
```

@remarks
Gets an amplifier that may have been applied to this effect.
Valid values are integers starting at 0 and up - but usually
ranging between 0 and 4.

/

### `chance`
```ts
readonly chance: number;
```

@remarks
Chance that this effect is applied as a result of the entity
being fed this item. Valid values range between 0 and 1.

/

### `duration`
```ts
readonly duration: number;
```

@remarks
Gets the duration, in ticks, of this effect.

/

### `name`
```ts
readonly name: string;
```

@remarks
Gets the identifier of the effect to apply. Example values
include 'fire_resistance' or 'regeneration'.

/
