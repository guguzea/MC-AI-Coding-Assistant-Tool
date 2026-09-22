> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.363Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# ItemComponentRegistry (class)

```ts
export class ItemComponentRegistry {
```

Provides the functionality for registering custom components
for items.

## Members（2）

### `private`
```ts
private constructor();
```

### `registerCustomComponent`
```ts
registerCustomComponent(name: string, itemCustomComponent: ItemCustomComponent): void;
```

@remarks
Registers an item custom component that can be used in item
JSON configuration.

This function can be called in early-execution mode.

@param name
The id that represents this custom component. Must have a
namespace. This id can be specified in a item's JSON
configuration under the 'minecraft:custom_components' item
component.
@param itemCustomComponent
The collection of event functions that will be called when
the event occurs on an item using this custom component id.
@throws This function can throw errors.

{@link CustomComponentInvalidRegistryError}

{@link minecraftcommon.EngineError}

{@link ItemCustomComponentAlreadyRegisteredError}

{@link ItemCustomComponentReloadNewComponentError}

{@link ItemCustomComponentReloadNewEventError}

{@link ItemCustomComponentReloadVersionError}

{@link NamespaceNameError}
/
