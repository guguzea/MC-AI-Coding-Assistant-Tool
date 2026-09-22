> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.520Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PressurePlatePopAfterEvent (class)

```ts
export class PressurePlatePopAfterEvent extends BlockEvent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `previousRedstonePower`
```ts
readonly previousRedstonePower: number;
```

@remarks
The redstone power of the pressure plate before it was
popped.

/

### `redstonePower`
```ts
readonly redstonePower: number;
```

@remarks
The redstone power of the pressure plate at the time of the
pop.

/
