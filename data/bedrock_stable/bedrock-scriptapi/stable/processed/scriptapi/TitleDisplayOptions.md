> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.710Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# TitleDisplayOptions (interface)

```ts
export interface TitleDisplayOptions {
```

Contains additional options for displaying a title and
optional subtitle.

## Members（4）

### `fadeInDuration`
```ts
fadeInDuration: number;
```

@remarks
Fade-in duration for the title and subtitle, in ticks. There
are 20 ticks per second. Use {@link TicksPerSecond} constant
to convert between ticks and seconds.

/

### `fadeOutDuration`
```ts
fadeOutDuration: number;
```

@remarks
Fade-out time for the title and subtitle, in ticks. There
are 20 ticks per second. Use {@link TicksPerSecond} constant
to convert between ticks and seconds.

/

### `stayDuration`
```ts
stayDuration: number;
```

@remarks
Amount of time for the title and subtitle to stay in place,
in ticks. There are 20 ticks per second. Use {@link
TicksPerSecond} constant to convert between ticks and
seconds.

/

### `subtitle`
```ts
subtitle?: (RawMessage | string)[] | RawMessage | string;
```

@remarks
Optional subtitle text.

/
