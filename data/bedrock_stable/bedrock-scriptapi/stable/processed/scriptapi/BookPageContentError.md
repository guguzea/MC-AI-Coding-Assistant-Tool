> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.720Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BookPageContentError (class)

```ts
export class BookPageContentError extends Error {
```

## Members（3）

### `private`
```ts
private constructor();
```

### `pageIndex`
```ts
readonly pageIndex: number;
```

@remarks
The index of the page requested to be modified.

This property can be read in early-execution mode.

/

### `reason`
```ts
readonly reason: BookErrorReason;
```

@remarks
The reason for the error.

This property can be read in early-execution mode.

/
