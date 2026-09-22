> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.595Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockContainerAccessEventOptions (interface)

```ts
export interface BlockContainerAccessEventOptions {
```

Options used to filter block container access events.

## Members（2）

### `accessSourceFilter`
```ts
accessSourceFilter?: ContainerAccessSourceFilter;
```

@remarks
If present will filter which container access sources can
trigger the event.

/

### `blockFilter`
```ts
blockFilter?: BlockFilter;
```

@remarks
If present will filter which container blocks can trigger
the event.

/
