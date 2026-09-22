> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.367Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemCompostableComponent (class)

```ts
export class ItemCompostableComponent extends ItemComponent {
```

## Members（2）

### `private`
```ts
private constructor();
```

### `compostingChance`
```ts
readonly compostingChance: number;
static readonly componentId = 'minecraft:compostable';
```

@remarks
This is the percent chance of the item composting in the
composter block and generating a compost layer. Note this
api will also return the composting chance for vanilla items
that are compostable but do not use the compostable item
component.

@throws
Throws if value outside the range [1 - 100]
/
