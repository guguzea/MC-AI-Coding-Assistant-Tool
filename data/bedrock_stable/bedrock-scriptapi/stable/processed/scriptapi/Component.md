> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.190Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# Component (class)

```ts
export class Component {
```

Base class for downstream Component implementations.

## Members（3）

### `private`
```ts
private constructor();
```

### `isValid`
```ts
readonly isValid: boolean;
```

@remarks
Returns whether the component is valid. A component is
considered valid if its owner is valid, in addition to any
addition to any additional validation required by the
component.

/

### `typeId`
```ts
readonly typeId: string;
```

@remarks
Identifier of the component.

/
