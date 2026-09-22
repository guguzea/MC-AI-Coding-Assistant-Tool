> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.709Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TickingAreaOptions (interface)

```ts
export interface TickingAreaOptions {
```

Options to create a ticking area using the {@link
TickingAreaManager}.

## Members（3）

### `dimension`
```ts
dimension: Dimension;
```

@remarks
The dimension the ticking area will be in.

/

### `from`
```ts
from: Vector3;
```

@remarks
Corner block location of the bounding box.

/

### `to`
```ts
to: Vector3;
```

@remarks
Opposite corner block location of the bounding box.

/
