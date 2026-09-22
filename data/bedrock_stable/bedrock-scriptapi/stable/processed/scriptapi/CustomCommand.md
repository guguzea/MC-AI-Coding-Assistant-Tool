> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.622Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# CustomCommand (interface)

```ts
export interface CustomCommand {
```

Define the custom command, including name, permissions, and
parameters.

## Members（6）

### `cheatsRequired`
```ts
cheatsRequired?: boolean;
```

@remarks
Cheats must be enabled to run this command. Defaults to
true.

/

### `description`
```ts
description: string;
```

@remarks
Command description as seen on the command line.

/

### `mandatoryParameters`
```ts
mandatoryParameters?: CustomCommandParameter[];
```

@remarks
List of mandatory command parameters.

/

### `name`
```ts
name: string;
```

@remarks
The name of the command. A namespace is required.

/

### `optionalParameters`
```ts
optionalParameters?: CustomCommandParameter[];
```

@remarks
List of optional command parameters.

/

### `permissionLevel`
```ts
permissionLevel: CommandPermissionLevel;
```

@remarks
The permission level required to execute the command.

/
