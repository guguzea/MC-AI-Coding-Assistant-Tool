> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.436Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PlayerAimAssist (class)

```ts
export class PlayerAimAssist {
```

A container for APIs related to player aim-assist.

## Members（3）

### `private`
```ts
private constructor();
```

### `settings`
```ts
readonly settings?: PlayerAimAssistSettings;
```

@remarks
The player's currently active aim-assist settings, or
undefined if not active.

/

### `set`
```ts
set(settings?: PlayerAimAssistSettings): void;
```

@remarks
Sets the player's aim-assist settings.

This function can't be called in restricted-execution mode.

@param settings
Aim-assist settings to activate for the player, if undefined
aim-assist will be disabled.
@throws This function can throw errors.

{@link minecraftcommon.ArgumentOutOfBoundsError}

{@link minecraftcommon.EngineError}

{@link Error}

{@link minecraftcommon.InvalidArgumentError}

{@link InvalidEntityError}

{@link NamespaceNameError}
/
