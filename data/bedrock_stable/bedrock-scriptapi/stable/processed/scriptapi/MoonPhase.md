> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.104Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# MoonPhase (enum)

```ts
export enum MoonPhase {
```

Enum containing the different phases of the moon based on
the current day.,Obtain the current MoonPhase using
world.getMoonPhase.

The fullness of the moon controls various mob behaviors such
as the number of slimes that spawn in Swamp biomes, the
chance skeletons and zombies have to spawn with armor, as
well as the chance for spiders to spawn with certain status
effects.

## Members（8）

### `FullMoon`
```ts
FullMoon = 0
```

### `WaningGibbous`
```ts
WaningGibbous = 1
```

### `FirstQuarter`
```ts
FirstQuarter = 2
```

### `WaningCrescent`
```ts
WaningCrescent = 3
```

### `NewMoon`
```ts
NewMoon = 4
```

### `WaxingCrescent`
```ts
WaxingCrescent = 5
```

### `LastQuarter`
```ts
LastQuarter = 6
```

### `WaxingGibbous`
```ts
WaxingGibbous = 7
```
