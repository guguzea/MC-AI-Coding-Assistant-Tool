> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.519Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Potions (class)

```ts
export class Potions {
```

Used for accessing all potion effect types, delivery types,
and creating potions.

## Members（6）

### `private`
```ts
private constructor();
```

### `getAllDeliveryTypes`
```ts
static getAllDeliveryTypes(): PotionDeliveryType[];
```

@remarks
Retrieves handles for all registered potion delivery types.

@returns
Array of all registered delivery type handles.
/

### `getAllEffectTypes`
```ts
static getAllEffectTypes(): PotionEffectType[];
```

@remarks
Retrieves all type handle for all registered potion effects.

@returns
Array of all registered effect type handles.
/

### `getDeliveryType`
```ts
static getDeliveryType(potionDeliveryId: string): PotionDeliveryType | undefined;
```

@remarks
Retrieves a type handle for a specified potion delivery id.

@returns
A type handle wrapping the valid delivery id, or undefined
for an invalid delivery id.
/

### `getEffectType`
```ts
static getEffectType(potionEffectId: string): PotionEffectType | undefined;
```

@remarks
Retrieves a type handle for a specified potion effect id.

@param potionEffectId
A valid potion effect id. See
@minecraft/vanilla-data.MinecraftPotionEffectTypes
@returns
A type handle wrapping the valid effect id, or undefined for
an invalid effect id.
/

### `resolve`
```ts
static resolve(
  potionEffectType: PotionEffectType | string,
  potionDeliveryType: PotionDeliveryType | string,
): ItemStack;
```

@remarks
Creates a potion given an effect and delivery type.

@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link InvalidPotionDeliveryTypeError}

{@link InvalidPotionEffectTypeError}
/
