> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.583Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# WeatherChangeBeforeEvent (class)

```ts
export class WeatherChangeBeforeEvent {
```

Contains information related to changes in weather in the
environment.

## Members（5）

### `private`
```ts
private constructor();
```

### `cancel`
```ts
cancel: boolean;
```

@remarks
If set to true the weather change will be cancelled.

/

### `duration`
```ts
duration: number;
```

@remarks
Sets the duration of the new weather (in ticks).

/

### `newWeather`
```ts
newWeather: WeatherType;
```

@remarks
The type of weather that will be applied.

/

### `previousWeather`
```ts
readonly previousWeather: WeatherType;
```

@remarks
The type of weather that it was prior to the event being
fired.

/
