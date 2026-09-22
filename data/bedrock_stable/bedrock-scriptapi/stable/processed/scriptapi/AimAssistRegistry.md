> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.137Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# AimAssistRegistry (class)

```ts
export class AimAssistRegistry {
```

A container for APIs related to the world's aim-assist
settings.

## Members（9）

### `private`
```ts
private constructor();
```

### `static`
```ts
static readonly DefaultCategoryId = 'minecraft:default';
```

@remarks
The default aim-assist category Id that is used when not
otherwise specified.

/

### `static`
```ts
static readonly DefaultPresetId = 'minecraft:aim_assist_default';
```

@remarks
The default aim-assist preset Id that is used when not
otherwise specified.

/

### `addCategory`
```ts
addCategory(category: AimAssistCategorySettings): AimAssistCategory;
```

@remarks
Adds an aim-assist category to the registry.

This function can't be called in restricted-execution mode.

@param category
The category settings used to create the new category.
@returns
The created category handle.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link Error}

{@link minecraftcommon.InvalidArgumentError}

{@link NamespaceNameError}
/

### `addPreset`
```ts
addPreset(preset: AimAssistPresetSettings): AimAssistPreset;
```

@remarks
Adds an aim-assist preset to the registry.

This function can't be called in restricted-execution mode.

@param preset
The preset settings used to create the new preset.
@returns
The created preset handle.
@throws This function can throw errors.

{@link minecraftcommon.EngineError}

{@link Error}

{@link minecraftcommon.InvalidArgumentError}

{@link NamespaceNameError}
/

### `getCategories`
```ts
getCategories(): AimAssistCategory[];
```

@remarks
Gets all available categories in the registry.

@returns
An array of all available category objects.
/

### `getCategory`
```ts
getCategory(categoryId: string): AimAssistCategory | undefined;
```

@remarks
Gets the category associated with the provided Id.

This function can't be called in restricted-execution mode.

@returns
The category object if it exists, otherwise returns
undefined.
/

### `getPreset`
```ts
getPreset(presetId: string): AimAssistPreset | undefined;
```

@remarks
Gets the preset associated with the provided Id.

This function can't be called in restricted-execution mode.

@param presetId
The Id of the preset to retrieve. Must have a namespace.
@returns
The preset object if it exists, otherwise returns undefined.
/

### `getPresets`
```ts
getPresets(): AimAssistPreset[];
```

@remarks
Gets all available presets in the registry.

@returns
An array of all available preset objects.
/
