> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.194Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# CustomCommandRegistry (class)

```ts
export class CustomCommandRegistry {
```

Provides the functionality for registering custom commands.

## Members（3）

### `private`
```ts
private constructor();
```

### `registerCommand`
```ts
registerCommand(
  customCommand: CustomCommand,
  callback: (origin: CustomCommandOrigin, ...args: any[]) => CustomCommandResult | undefined,
): void;
```

@remarks
Registers a custom command that when executed triggers a
script callback.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@param callback
The callback triggered when the command executes.
@throws This function can throw errors.

{@link CustomCommandError}

{@link minecraftcommon.EngineError}

{@link NamespaceNameError}
/

### `registerEnum`
```ts
registerEnum(name: string, values: string[]): void;
```

@remarks
Registers a custom command enum.

This function can't be called in restricted-execution mode.

This function can be called in early-execution mode.

@throws This function can throw errors.

{@link CustomCommandError}

{@link minecraftcommon.EngineError}

{@link NamespaceNameError}
/
