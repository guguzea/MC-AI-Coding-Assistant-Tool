> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.201Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# DimensionRegistry (class)

```ts
export class DimensionRegistry {
```

Provides the functionality for registering custom
dimensions. Custom dimensions can only be registered during
the system startup event.

## Members（2）

### `private`
```ts
private constructor();
```

### `registerCustomDimension`
```ts
registerCustomDimension(typeId: string): void;
```

@remarks
Registers a new custom dimension type. Must be called during
the system startup event. The dimension will be created
using the void generator.

This function can be called in early-execution mode.

@param typeId
The namespaced identifier for the custom dimension (e.g.,
'mypack:my_dimension'). Must include a namespace and use
only valid identifier characters.
@throws This function can throw errors.

{@link CustomDimensionAlreadyRegisteredError}

{@link CustomDimensionInvalidRegistryError}

{@link CustomDimensionNameError}

{@link CustomDimensionReloadNewDimensionError}

{@link minecraftcommon.EngineError}

{@link NamespaceNameError}
/
