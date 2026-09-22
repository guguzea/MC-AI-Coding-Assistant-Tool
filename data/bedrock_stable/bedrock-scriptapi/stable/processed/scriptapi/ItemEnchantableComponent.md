> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.371Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemEnchantableComponent (class)

```ts
export class ItemEnchantableComponent extends ItemComponent {
```

## Members（10）

### `private`
```ts
private constructor();
```

### `slots`
```ts
readonly slots: EnchantmentSlot[];
static readonly componentId = 'minecraft:enchantable';
```

@throws This property can throw when used.
/

### `addEnchantment`
```ts
addEnchantment(enchantment: Enchantment): void;
```

@remarks
Adds an enchantment to the item stack.

This function can't be called in restricted-execution mode.

@param enchantment
The enchantment interface to be added.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if the
enchantment type does not exist.

ScriptItemEnchantmentLevelOutOfBoundsError: Exception thrown
if the enchantment level is outside the allowable range for
the given enchantment type.

ScriptItemEnchantmentTypeNotCompatibleError: Exception
thrown if the enchantment is not compatible with the item
stack.


{@link EnchantmentLevelOutOfBoundsError}

{@link EnchantmentTypeNotCompatibleError}

{@link EnchantmentTypeUnknownIdError}

{@link Error}
/

### `addEnchantments`
```ts
addEnchantments(enchantments: Enchantment[]): void;
```

@remarks
Adds a list of enchantments to the item stack.

This function can't be called in restricted-execution mode.

@param enchantments
The list of enchantments to be added.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if any
enchantment type does not exist.

ScriptItemEnchantmentLevelOutOfBoundsError: Exception thrown
if any enchantment level is outside the allowable range for
the given enchantment type.

ScriptItemEnchantmentTypeNotCompatibleError: Exception
thrown if any enchantment is not compatible with the item
stack.


{@link EnchantmentLevelOutOfBoundsError}

{@link EnchantmentTypeNotCompatibleError}

{@link EnchantmentTypeUnknownIdError}

{@link Error}
/

### `canAddEnchantment`
```ts
canAddEnchantment(enchantment: Enchantment): boolean;
```

@remarks
Checks whether an enchantment can be added to the item
stack.

@param enchantment
The enchantment interface to be added.
@returns
Returns true if the enchantment can be added to the item
stack.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if the
enchantment type does not exist.

ScriptItemEnchantmentLevelOutOfBoundsError: Exception thrown
if the enchantment level is outside the allowable range for
the given enchantment type.


{@link EnchantmentLevelOutOfBoundsError}

{@link EnchantmentTypeUnknownIdError}
/

### `getEnchantment`
```ts
getEnchantment(enchantmentType: EnchantmentType | string): Enchantment | undefined;
```

@remarks
Gets the enchantment of a given type from the item stack.

@param enchantmentType
The enchantment type to get.
@returns
Returns the enchantment if it exists on the item stack.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if the
enchantment type does not exist.


{@link EnchantmentTypeUnknownIdError}
/

### `getEnchantments`
```ts
getEnchantments(): Enchantment[];
```

@remarks
Gets all enchantments on the item stack.

@returns
Returns a list of enchantments on the item stack.
@throws This function can throw errors.
/

### `hasEnchantment`
```ts
hasEnchantment(enchantmentType: EnchantmentType | string): boolean;
```

@remarks
Checks whether an item stack has a given enchantment type.

@param enchantmentType
The enchantment type to check for.
@returns
Returns true if the item stack has the enchantment type.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if the
enchantment type does not exist.


{@link EnchantmentTypeUnknownIdError}
/

### `removeAllEnchantments`
```ts
removeAllEnchantments(): void;
```

@remarks
Removes all enchantments applied to this item stack.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `removeEnchantment`
```ts
removeEnchantment(enchantmentType: EnchantmentType | string): void;
```

@remarks
Removes an enchantment of the given type.

This function can't be called in restricted-execution mode.

@param enchantmentType
The enchantment type to remove.
@throws
ScriptItemEnchantmentUnknownIdError: Exception thrown if the
enchantment type does not exist.


{@link EnchantmentTypeUnknownIdError}

{@link Error}
/
