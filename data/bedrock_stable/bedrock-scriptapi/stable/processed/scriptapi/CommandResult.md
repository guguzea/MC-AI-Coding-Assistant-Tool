> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.189Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# CommandResult (class)

```ts
export class CommandResult {
```

Contains return data on the result of a command execution.

## Members（2）

### `private`
```ts
private constructor();
```

### `successCount`
```ts
readonly successCount: number;
```

@remarks
If the command operates against a number of entities,
blocks, or items, this returns the number of successful
applications of this command.

/
