> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.220Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# EntityAttributeComponent (class)

```ts
export class EntityAttributeComponent extends EntityComponent {
```

## Members（9）

### `private`
```ts
private constructor();
```

### `currentValue`
```ts
readonly currentValue: number;
```

@remarks
Current value of this attribute for this instance.

@throws This property can throw when used.
/

### `defaultValue`
```ts
readonly defaultValue: number;
```

@remarks
Returns the default defined value for this attribute.

@throws This property can throw when used.
/

### `effectiveMax`
```ts
readonly effectiveMax: number;
```

@remarks
Returns the effective max of this attribute given any other
ambient components or factors.

@throws This property can throw when used.
/

### `effectiveMin`
```ts
readonly effectiveMin: number;
```

@remarks
Returns the effective min of this attribute given any other
ambient components or factors.

@throws This property can throw when used.
/

### `resetToDefaultValue`
```ts
resetToDefaultValue(): void;
```

@remarks
Resets the current value of this attribute to the defined
default value.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `resetToMaxValue`
```ts
resetToMaxValue(): void;
```

@remarks
Resets the current value of this attribute to the maximum
defined value.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `resetToMinValue`
```ts
resetToMinValue(): void;
```

@remarks
Resets the current value of this attribute to the minimum
defined value.

This function can't be called in restricted-execution mode.

@throws This function can throw errors.
/

### `setCurrentValue`
```ts
setCurrentValue(value: number): boolean;
```

@remarks
Sets the current value of this attribute.

This function can't be called in restricted-execution mode.

@throws
If the value is out of bounds, an ArgumentOutOfBounds Error
is thrown.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link InvalidEntityError}
/
