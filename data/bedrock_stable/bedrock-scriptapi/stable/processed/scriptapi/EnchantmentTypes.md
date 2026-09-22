> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.213Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EnchantmentTypes (class)

```ts
export class EnchantmentTypes {
```

Contains a catalog of Minecraft Enchantment Types that are
available in this world.

## Members（3）

### `private`
```ts
private constructor();
```

### `get`
```ts
static get(enchantmentId: string): EnchantmentType | undefined;
```

@remarks
Retrieves an enchantment with the specified identifier.

@param enchantmentId
Identifier of the enchantment.  For example,
"minecraft:flame".
@returns
If available, returns an EnchantmentType object that
represents the specified enchantment.
/

### `getAll`
```ts
static getAll(): EnchantmentType[];
```

@remarks
Returns a collection of all available enchantment types.

/
