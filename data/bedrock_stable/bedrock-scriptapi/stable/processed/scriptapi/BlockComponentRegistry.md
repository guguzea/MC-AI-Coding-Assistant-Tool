> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.153Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockComponentRegistry (class)

```ts
export class BlockComponentRegistry {
```

## Members（2）

### `private`
```ts
private constructor();
```

### `registerCustomComponent`
```ts
registerCustomComponent(name: string, customComponent: BlockCustomComponent): void;
```

@remarks
This function can be called in early-execution mode.

@throws This function can throw errors.

{@link BlockCustomComponentAlreadyRegisteredError}

{@link BlockCustomComponentReloadNewComponentError}

{@link BlockCustomComponentReloadNewEventError}

{@link BlockCustomComponentReloadVersionError}

{@link CustomComponentInvalidRegistryError}

{@link minecraftcommon.EngineError}

{@link NamespaceNameError}
/
