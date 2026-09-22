> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.372Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemFoodComponent (class)

```ts
export class ItemFoodComponent extends ItemComponent {
```

## Members（5）

### `private`
```ts
private constructor();
```

### `canAlwaysEat`
```ts
readonly canAlwaysEat: boolean;
```

@remarks
If true, the player can always eat this item (even when not
hungry).

@throws This property can throw when used.
/

### `nutrition`
```ts
readonly nutrition: number;
```

@remarks
Represents how much nutrition this food item will give an
entity when eaten.

@throws This property can throw when used.
/

### `saturationModifier`
```ts
readonly saturationModifier: number;
```

@remarks
When an item is eaten, this value is used according to this
formula (nutrition * saturation_modifier * 2) to apply a
saturation buff.

@throws This property can throw when used.
/

### `usingConvertsTo`
```ts
readonly usingConvertsTo: string;
static readonly componentId = 'minecraft:food';
```

@remarks
When specified, converts the active item to the one
specified by this property.

@throws This property can throw when used.
/
