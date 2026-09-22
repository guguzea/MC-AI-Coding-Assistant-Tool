> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.429Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# MatchToolCondition (class)

```ts
export class MatchToolCondition extends LootItemCondition {
```

## Members（8）

### `private`
```ts
private constructor();
```

### `count`
```ts
readonly count: minecraftcommon.NumberRange;
```

@remarks
The stack size, or count, required for this condition to
pass.

/

### `durability`
```ts
readonly durability: minecraftcommon.NumberRange;
```

@remarks
The durability value required for this condition to pass.

/

### `enchantments`
```ts
readonly enchantments: EnchantInfo[];
```

@remarks
Array of enchantments required for this condition to pass.

/

### `itemName`
```ts
readonly itemName: string;
```

@remarks
The name of the tool item required for this condition to
pass.

/

### `itemTagsAll`
```ts
readonly itemTagsAll: string[];
```

@remarks
Array of item tags which ALL must be matched for this
condition to pass.

/

### `itemTagsAny`
```ts
readonly itemTagsAny: string[];
```

@remarks
Array of item tags, from which at least 1 must be matched
for this condition to pass.

/

### `itemTagsNone`
```ts
readonly itemTagsNone: string[];
```

@remarks
Array of item tags, from which exactly zero must match for
this condition to pass.

/
