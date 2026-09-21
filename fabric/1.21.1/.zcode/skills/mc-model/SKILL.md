---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-model

> 本档正文的类名 / JSON 字段 / 文件路径只来自 `data/fabric_1.21.1` 本档语料。实读页面：
> `fabric-docs/1.21.1/processed/develop_blocks_blockstates.md`、`fabric-docs/1.21.1/processed/develop_blocks_first-block.md`（其「Models and Textures」与「Blockstate」两节）。
> 代码 / JSON 真身（页面里的 `@[code](@/reference/...)` 转引目标，均已在盘上并逐字读过）：
> `reference/1.21.1/src/main/java/com/example/docs/block/ModBlocks.java`、`reference/1.21.1/src/main/java/com/example/docs/block/custom/PrismarineLampBlock.java`、`reference/1.21.1/src/main/resources/assets/example-mod/blockstates/{condensed_dirt,condensed_oak_log,prismarine_lamp}.json`、`reference/1.21.1/src/main/resources/assets/example-mod/models/block/{condensed_dirt,condensed_oak_log_horizontal}.json`、`reference/1.21.1/src/main/resources/assets/example-mod/models/item/condensed_dirt.json`。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.20.4 / 1.21.3 / 1.21.11）补全。
>
> ⚠️ mappings：本档 frontmatter 记 `mappings: yarn`，但上述页面与参考文件一律用官方名（`ResourceLocation`、`RotatedPillarBlock`、`BooleanProperty`）。按工程实际映射写，禁止两套名混写。
> ⚠️ 本档语料**没有**独立的 block model / item model 讲解页（`develop_blocks_block-models.md`、`develop_items_item-models.md` 均不在本档 processed 内），所以模型字段面只到「本档 JSON 实例出现过的键」为止，见文末缺口清单。

## 文件位置与命名

- **blockstate 定义**：`assets/example-mod/blockstates/`（页内路径写法带 `example-mod` 连字符 modid）。文件名必须与注册时用的 block ID 一致——blockstates 页原话：block ID 是 `condensed_oak_log` ⇒ 文件叫 `condensed_oak_log.json`；first-block 页对 `condensed_dirt` 有同一句话。
- **block model**：`assets/example-mod/models/block/<name>.json`；**item model**：`assets/example-mod/models/item/<name>.json`（两文件路径在 first-block 页逐字列出）。
- **纹理**：`assets/example-mod/textures/block/`。
- blockstate 定义的作用（first-block 页原话）：「instruct the game on which model to render based on the current state of the block」。

## 最简三件套（照抄本档参考 JSON）

无属性方块只需要三条 JSON：

`models/block/condensed_dirt.json`：

```json
{
  "parent": "block/cube_all",
  "textures": {
    "all": "example-mod:block/condensed_dirt"
  }
}
```

`models/item/condensed_dirt.json`（页内说明：item model 直接把 block model 当 parent，因为多数 block model 支持在 GUI 里渲染）：

```json
{
  "parent": "example-mod:block/condensed_dirt"
}
```

`blockstates/condensed_dirt.json`（first-block 页：没有复杂 blockstate 时「only one entry is needed」）：

```json
{
  "variants": {
    "": { "model": "example-mod:block/condensed_dirt" }
  }
}
```

> 注意：本档参考文件里父模型写 `"block/cube_all"` / `"block/cube_column_horizontal"`，**不带** `minecraft:` 前缀。邻档（1.21.11）的 generated 产物带前缀，不要互抄。

## 柱状方块：两个 model + 三条 variant

blockstates 页：pillar 方块有 top / side 两张图，用 `block/cube_column` 模型；横、竖两个位置要两个 model 文件——`condensed_oak_log_horizontal.json` 继承 `block/cube_column_horizontal`，`condensed_oak_log.json` 继承 `block/cube_column`。

`models/block/condensed_oak_log_horizontal.json`（本档真身）：

```json
{
  "parent": "block/cube_column_horizontal",
  "textures": {
    "end": "example-mod:block/condensed_oak_log_top",
    "side": "example-mod:block/condensed_oak_log"
  }
}
```

`blockstates/condensed_oak_log.json`（本档真身；页内对三条 variant 的解释：`axis=x` 转向正 X、`axis=y` 用竖模型、`axis=z` 转向正 Z）：

```json
{
  "variants": {
    "axis=x": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90, "y": 90 },
    "axis=y": { "model": "example-mod:block/condensed_oak_log" },
    "axis=z": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90 }
  }
}
```

对应的 Java 侧就是 vanilla `RotatedPillarBlock`（页内：它允许方块沿 X / Y / Z 轴放置）。本档参考文件里的注册写法：

```java
public static final Block CONDENSED_OAK_LOG = register(
		new RotatedPillarBlock(
				BlockBehaviour.Properties.of()
						.sound(SoundType.WOOD)
		), "condensed_oak_log", true
);
```

## 自定义属性怎么映射到模型

blockstates 页的示例是 `activated` 布尔属性（右键在 `activated=false` ↔ `activated=true` 之间翻转并换图）。页内给的三步：用 `BooleanProperty.create` 造属性、在 `createBlockStateDefinition` 里把属性加进 builder、在构造器里设默认状态。本档参考文件真身：

```java
public class PrismarineLampBlock extends Block {
	public static final BooleanProperty ACTIVATED = BooleanProperty.create("activated");

	public PrismarineLampBlock(Properties settings) {
		super(settings);
		registerDefaultState(defaultBlockState().setValue(ACTIVATED, false));
	}

	@Override
	protected void createBlockStateDefinition(StateDefinition.Builder<Block, BlockState> builder) {
		builder.add(ACTIVATED);
	}

	public static int getLuminance(BlockState currentBlockState) {
		boolean activated = currentBlockState.getValue(PrismarineLampBlock.ACTIVATED);
		return activated ? 15 : 0;
	}
}
```

翻转状态（本档参考文件里参数名是 `world`）：

```java
boolean activated = state.getValue(ACTIVATED);
world.setBlockAndUpdate(pos, state.setValue(ACTIVATED, !activated));
```

`blockstates/prismarine_lamp.json`（本档真身）：

```json
{
  "variants": {
    "activated=false": { "model": "example-mod:block/prismarine_lamp" },
    "activated=true":  { "model": "example-mod:block/prismarine_lamp_on" }
  }
}
```

页内两条硬提示：
- 多个属性要覆盖**全部组合**——`activated` × `axis` = 2×3 = 6 条 variant。
- blockstate 文件名要和注册的 block ID 对齐；「别忘了用自定义类而不是 `Block` 去注册你的方块」。
- 该页还要求：给方块建 translation，并且建一个 parent 到两个模型之一的 **item model**。

发光：页内说用 `luminance` 方法设置方块发出的光级，把 `PrismarineLampBlock::getLuminance` 作为方法引用传进去 ⇒ 本档方法名是 `luminance`（1.21.11 档写作 `lightLevel`，禁止互抄）。

import 面（照抄自本档参考文件）：`net.minecraft.core.BlockPos`、`net.minecraft.world.InteractionResult`、`net.minecraft.world.entity.player.Player`、`net.minecraft.world.level.Level`、`net.minecraft.world.level.block.Block`、`net.minecraft.world.level.block.state.BlockState`、`net.minecraft.world.level.block.state.StateDefinition`、`net.minecraft.world.level.block.state.properties.BooleanProperty`、`net.minecraft.world.phys.BlockHitResult`、`net.minecraft.world.level.block.RotatedPillarBlock`、`net.minecraft.world.level.block.SoundType`、`net.minecraft.world.level.block.state.BlockBehaviour`。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.1/reference/1.21.1/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `BlockBehaviour` | `AbstractBlock` | 1.16.5–1.21.11 | join（`net.minecraft.block.AbstractBlock`） |
| `SoundType` | `BlockSoundGroup` | 1.14.4–1.21.11 | join（`net.minecraft.sound.BlockSoundGroup`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- **block model 的完整字段规范**（`ambientocclusion`、`display`、`elements` / `from` / `to` / `faces` / `uv` / `cullface` / `tintindex`、`shade`、`light_emission`）：本档 processed 里**没有** block-models / item-models 页，上述键一个都没在本档正文出现过 ⇒ 一律 `TODO(未核实)`。要做自定义形状模型时改口 `search_fabric_docs(version=1.21.1, query="block model elements")`，或按 1.21.1 官方文档对应页现读现抄；**不要**抄 1.21.11 档的本主题正文。
- **datagen 生成模型 / blockstate**：本档只有 `develop_data-generation_{advancements,loot-tables,recipes,setup,tags,translations}.md`，**没有** block-models / item-models datagen 页 ⇒ `FabricModelProvider`、`BlockModelGenerators` 等名字在本档语料未出现，禁止默写签名。
- **`multipart` blockstate**：本档示例只有 `variants`。
- **纹理图集、`BlockColors` 注册、模型旋转的 Java 侧 API**：本档无语料。
- **`generate_model` MCP 工具**：只吐文本骨架，且其参数面不校验本档键名；不能替代上面的缺口。

## 相关

- 方块与属性：`02-block.mdc` / `mc-block`；注册：`01-registry.mdc` / `mc-registry`
- 物品模型引用：`03-item.mdc` / `mc-item`
- 反模式：`fabric/1.21.1/knowledge/antipatterns/`
- 全文核对：`get_fabric_doc_full(version="1.21.1", id="develop_blocks_blockstates")` / `id="develop_blocks_first-block"`
