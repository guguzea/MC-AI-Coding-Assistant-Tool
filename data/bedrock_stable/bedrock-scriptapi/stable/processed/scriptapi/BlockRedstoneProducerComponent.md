> 来源：https://unpkg.com/@minecraft/server@2.9.0/index.d.ts
> 抓取时间：2026-09-21T16:26:07.175Z
> 警告：此文档可能滞后于当前正式版
> 出处：npm @minecraft/server@2.9.0 的 index.d.ts（TypeScript 声明解析，不是 Learn HTML 转储）
> 版权：源文件头为 Microsoft Corporation 版权声明；本页只保留该声明片段并标出处
> 模块版本：2.9.0｜unpkg


# BlockRedstoneProducerComponent (class)

```ts
export class BlockRedstoneProducerComponent extends BlockComponent {
```

## Members（4）

### `private`
```ts
private constructor();
```

### `power`
```ts
readonly power: number;
static readonly componentId = 'minecraft:redstone_producer';
```

@remarks
Gets the power that this block outputs to circuit system.
Returns error if block is no longer valid or if block
doesn't have a 'minecraft:redstone_producer' component.

@throws This property can throw when used.

{@link InvalidBlockComponentError}
/

### `getConnectedFaces`
```ts
getConnectedFaces(): Direction[];
```

@remarks
Gets the faces of this block that can connect to the circuit
and output power. Returns error if block is no longer valid
or if block doesn't have a 'minecraft:redstone_producer'
component.

@throws This function can throw errors.

{@link InvalidBlockComponentError}
/

### `getStronglyPoweredFace`
```ts
getStronglyPoweredFace(): Direction | undefined;
```

@remarks
Gets the block face that strongly powers the block touching
it. If the 'minecraft:redstone_producer' block component
hasn't defined a 'strongly_powered_face' then this method
returns 'undefined'. Returns error if block is no longer
valid or if block doesn't have a
'minecraft:redstone_producer' component.

@throws This function can throw errors.

{@link InvalidBlockComponentError}
/
