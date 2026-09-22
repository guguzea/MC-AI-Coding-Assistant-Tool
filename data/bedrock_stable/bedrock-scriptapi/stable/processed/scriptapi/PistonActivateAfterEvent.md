> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.433Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# PistonActivateAfterEvent (class)

```ts
export class PistonActivateAfterEvent extends BlockEvent {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `isExpanding`
```ts
readonly isExpanding: boolean;
```

@remarks
True if the piston is the process of expanding.

/

### `piston`
```ts
readonly piston: BlockPistonComponent;
```

@remarks
Contains additional properties and details of the piston.

/
