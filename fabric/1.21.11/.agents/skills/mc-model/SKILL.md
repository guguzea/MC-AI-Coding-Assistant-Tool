---
name: mc-model
description: JSON 模型、blockstate、item model、generate_model。触发词：blockstates、models、cube_all
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-model

> 本档正文的类名 / JSON 字段 / 文件路径只来自 `data/fabric_1.21.11` 本档语料。实读页面：
> `fabric-docs/1.21.11/processed/develop_blocks_block-models.md`、`fabric-docs/1.21.11/processed/develop_blocks_blockstates.md`、`fabric-docs/1.21.11/processed/develop_items_item-models.md`、`fabric-docs/1.21.11/processed/develop_data-generation_block-models.md`。
> 代码 / JSON 真身（页面里的 `@[code](@/reference/...)` 转引目标，均已在盘上并逐字读过）：
> `reference/1.21.11/src/main/java/com/example/docs/block/ModBlocks.java`、`reference/1.21.11/src/main/java/com/example/docs/block/custom/PrismarineLampBlock.java`、`reference/1.21.11/src/main/generated/assets/example-mod/blockstates/{condensed_oak_log,prismarine_lamp,steel_block}.json`、`reference/1.21.11/src/main/generated/assets/example-mod/models/block/{condensed_oak_log_horizontal,steel_block}.json`、`reference/1.21.11/src/client/java/com/example/docs/datagen/ExampleModModelProvider.java`。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.1 / 26.1.2）补全。
>
> ⚠️ 转引缺口：`develop_blocks_block-models.md` 的 `parent` / `display` / `elements` 三节是**未展开**的 `<!--@include: ../items/item-models.md#...-->` 标记（该 include 目标未落进本页正文）。本节对应字段取自同档已完整成文的 `develop_items_item-models.md`。
> ⚠️ mappings：本档 frontmatter 记 `mappings: yarn`，但上述页面与参考文件正文一律用官方名（`RotatedPillarBlock`、`Identifier`、`BooleanProperty`）。按工程实际映射写，禁止两套名混写。

## 三类文件的分工与位置

- **blockstate 定义**：`assets/<modid>/blockstates/<blockid>.json`。文件名必须与注册时用的 block ID 一致（页内原话：block ID 是 `condensed_oak_log` ⇒ 文件叫 `condensed_oak_log.json`）。
- **block model**：`assets/<modid>/models/block/*.json`；**item model**：`assets/<modid>/models/item/*.json`。方块物品的 item model 直接把 block model 当 `parent`。
- **纹理**：`assets/<modid>/textures/block/`。
- 模型以 JSON 形式存在 `resources` 文件夹内。

## Block model 的 JSON 骨架（照抄 block-models 页的 scheme）

```json
{
  "parent": "...",
  "ambientocclusion": "true/false",
  "display": {
    "<position>": { "rotation": [0.0, 0.0, 0.0], "translation": [0.0, 0.0, 0.0], "scale": [0.0, 0.0, 0.0] }
  },
  "textures": { "particle": "...", "<texture_variable>": "..." },
  "elements": [
    {
      "from": [0.0, 0.0, 0.0],
      "to": [0.0, 0.0, 0.0],
      "rotation": { "origin": [0.0, 0.0, 0.0], "axis": "...", "angle": "...", "rescale": "true/false" },
      "shade": "true/false",
      "light_emission": "...",
      "faces": {
        "<key>": { "uv": [0, 0, 0, 0], "texture": "...", "cullface": "...", "rotation": "...", "tintindex": "..." }
      }
    }
  ]
}
```

字段要点（逐条来自 block-models 页 + item-models 页对应小节）：

- `parent`：以 `namespace:path` 加载另一个模型及其全部属性；block 页另有一句——设为 `builtin/generated` 时用「由指定图标生成的模型」，旋转走 blockstate。
- `ambientocclusion`：是否使用环境光遮蔽，默认 `true`。
- `textures`：值可以是标识符或纹理变量。`particle` 决定粒子取哪张纹理（也在传送门内当叠加层、用于水/岩浆的静水纹理），同时自身可被 `#particle` 引用；`"top": "namespace:path"` ⇒ 之后可写 `#top`。
- `elements`：只能是立方体；若本文件同时给了 `parent` 和 `elements`，本文件的 `elements` 覆盖父模型的。
- `from` / `to`：立方体起止点 `[x, y, z]`，标准方块为 `[0,0,0]`→`[16,16,16]`；取值范围 **-16 ~ 32**，故单个模型最大 3×3 格。
- `rotation`：`origin` 三浮点；`axis` ∈ {`x`,`y`,`z`}；`angle` 范围 **-45 ~ 45**；`rescale` 默认 `false`。
- `shade`：是否渲染阴影，默认 `true`；`light_emission`：元素能收到的最低光级，**0 ~ 15**，默认 0。
- `faces` 的键 ∈ {`down`,`up`,`north`,`south`,`west`,`east`}，未给的键不渲染：
  - `uv` 四整数 `[x1,y1,x2,y2]`，不写则按元素位置自动生成；翻转 `x1`/`x2` 即翻转纹理。
  - `texture`：以 `#` 前缀引用纹理变量。
  - `cullface`：指定朝向有相邻方块时不渲染该面；同时决定该面取光的方向，未设时按该侧取。
  - `rotation`：整数，90° 步进旋转纹理，不改变取哪块 UV。
  - `tintindex`（页面正文另写作 `tintidex`，拼写以页面为准）：整数，block 页说默认 `-1` 表示不上色、其它值交给 `BlockColors` 取该索引的染色；item 页则说「取色引用自 client item，没有色或为白则不上色」。两页表述不同，按你要做的面各读各的。
- `display.<position>` 取值集合（item-models 页表格）：`firstperson_righthand` / `firstperson_lefthand` / `thirdperson_righthand` / `thirdperson_lefthand` / `gui` / `head` / `ground` / `fixed`；其中 `translation` 限 **-80 ~ 80**、`scale` 上限 **4**。
- item 模型专属（item-models 页）：`textures.<layerN>`（ inventory 图标，最多 3 层，**仅当 `parent` 为 `item/generated` 才生效**）、`gui_light` ∈ {`front`,`side`}（默认 `side`）、`parent` 可设 `item/generated` 或 `builtin/generated`。

## 本档参考代码里的真实模型 JSON

`models/block/condensed_oak_log_horizontal.json`：

```json
{
  "parent": "minecraft:block/cube_column_horizontal",
  "textures": {
    "end": "example-mod:block/condensed_oak_log_top",
    "side": "example-mod:block/condensed_oak_log"
  }
}
```

`models/block/steel_block.json`：

```json
{
  "parent": "minecraft:block/cube_all",
  "textures": { "all": "example-mod:block/steel_block" }
}
```

> 本档 generated 产物里父模型带 `minecraft:` 命名空间前缀。柱状方块用 `block/cube_column` 系；页内说明「pillar block 两个位置（横 / 竖）要两个 model 文件」。

## Blockstate 文件

无属性方块 ⇒ 一条空键变体即可（`blockstates/steel_block.json`）：

```json
{ "variants": { "": { "model": "example-mod:block/steel_block" } } }
```

`axis` 原柱方块（`blockstates/condensed_oak_log.json`，配 `RotatedPillarBlock`）：

```json
{
  "variants": {
    "axis=x": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90, "y": 90 },
    "axis=y": { "model": "example-mod:block/condensed_oak_log" },
    "axis=z": { "model": "example-mod:block/condensed_oak_log_horizontal", "x": 90 }
  }
}
```

自定义布尔属性（`blockstates/prismarine_lamp.json`）：

```json
{
  "variants": {
    "activated=false": { "model": "example-mod:block/prismarine_lamp" },
    "activated=true":  { "model": "example-mod:block/prismarine_lamp_on" }
  }
}
```

页内提示：属性多了要覆盖**全部组合**（`activated` × `axis` = 2×3 = 6 条）。

## Java 侧：属性怎么进 blockstate（照抄 PrismarineLampBlock.java）

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

- 运行时改状态：`level.setBlockAndUpdate(pos, state.setValue(ACTIVATED, !activated))`；读值 `state.getValue(ACTIVATED)`。
- 注册时：`BlockBehaviour.Properties.of().sound(SoundType.LANTERN).lightLevel(PrismarineLampBlock::getLuminance)`（本档键名是 `lightLevel`；邻档写作 `luminance`，禁止互抄）。
- import 面（照抄即用）：`net.minecraft.world.level.block.Block`、`net.minecraft.world.level.block.state.BlockState`、`net.minecraft.world.level.block.state.StateDefinition`、`net.minecraft.world.level.block.state.properties.BooleanProperty`、`net.minecraft.world.level.block.state.BlockBehaviour`、`net.minecraft.world.level.block.RotatedPillarBlock`、`net.minecraft.world.level.block.SoundType`。

## 用 datagen 生成模型与 blockstate

`ExampleModModelProvider extends FabricModelProvider`（`net.fabricmc.fabric.api.client.datagen.v1.provider.FabricModelProvider`），构造收 `FabricDataOutput`，实现两个抽象方法：

```java
@Override
public void generateBlockStateModels(BlockModelGenerators blockStateModelGenerator) {
	blockStateModelGenerator.createTrivialCube(ModBlocks.STEEL_BLOCK);                        // cube_all，六面同图
	blockStateModelGenerator.createTrivialBlock(ModBlocks.PIPE_BLOCK, TexturedModel.COLUMN_ALT); // 侧面 + 顶底异图
	blockStateModelGenerator.family(ModBlocks.RUBY_BLOCK)
			.stairs(ModBlocks.RUBY_STAIRS).slab(ModBlocks.RUBY_SLAB).fence(ModBlocks.RUBY_FENCE);
	blockStateModelGenerator.createDoor(ModBlocks.RUBY_DOOR);
	blockStateModelGenerator.createTrapdoor(ModBlocks.RUBY_TRAPDOOR);
	// blockStateModelGenerator.registerOrientableTrapdoor(ModBlocks.RUBY_TRAPDOOR);  // 参考文件里以注释形式给出
}

@Override
public void generateItemModels(ItemModelGenerators itemModelGenerator) {
	itemModelGenerator.generateFlatItem(ModItems.RUBY, ModelTemplates.FLAT_ITEM);
	itemModelGenerator.generateFlatItem(ModItems.GUIDITE_AXE, ModelTemplates.FLAT_HANDHELD_ITEM);
	itemModelGenerator.generateDyedItem(ModItems.LEATHER_GLOVES, 0xFFA06540);
}
```

- 注册 provider：`DataGeneratorEntrypoint#onInitializeDataGenerator` 内 `pack.addProvider(ExampleModModelProvider::new);`。
- `BlockFamily` 分支：`blockStateModelGenerator.family(ModBlocks.RUBY_BLOCK).generateFor(ModBlocks.RUBY_FAMILY);`
- 自定义模型走 `ModelTemplate` + `TextureSlot` + `TextureMapping`（参考文件逐字）：
  `new ModelTemplate(Optional.of(Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "block/vertical_slab")), Optional.empty(), TextureSlot.BOTTOM, TextureSlot.TOP, TextureSlot.SIDE)`；
  映射 `new TextureMapping().put(TextureSlot.TOP, ModelLocationUtils.getModelLocation(block, "_top"))`；页内说 `TextureMapping.cube()` 会把所有 `TextureSlot` 绑到同一个标识符。
- 变体派发：页内说用 `MultiVariantGenerator.dispatch()` 造 `BlockModelDefinitionGenerator`，把各变体装进 `PropertyDispatch` 再 `.register()`（可控 uvlock / 旋转）。这三个类名在本档参考文件的 import 里逐字出现过。
- ⚠️ 页面**正文措辞**与本档**参考代码**不完全一致：页内还点了 `registerSingleton`、`registerCubeAllModelTexturePool`、`BlockModelGenerators.registerSimpleItemModel()` 三个名字，它们在本次读到的参考文件里**未出现**。要用之前先 `get_fabric_doc_full(version="1.21.11", id="develop_data-generation_block-models")` 或核对本机 `BlockModelGenerators` 源码 ⇒ 现状按 `// TODO(未核实)` 处理。


### ⚠️ 映射口径：本档语料是 mojmap

本文件下面引 `search_fabric_docs` / `get_fabric_doc_full` 抄来的类名是 **mojmap 原名** —— 因为本档语料本身是 mojmap：`data/fabric_1.21.11/reference/1.21.11/build.gradle` 写 `mappings loom.officialMojangMappings()`。
但本档 `scaffold/gradle.properties` 钉的是 Yarn（工程默认映射按本档 `.cursor/rules/00-project-setup.mdc` 与 frontmatter 为准），**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `ItemModelGenerators` | `ItemModelGenerator` | 1.16.5–1.21.11 | join（`net.minecraft.client.data.ItemModelGenerator`） |
| `BlockModelGenerators` | `BlockStateModelGenerator` | 1.16.5–1.21.11 | join（`net.minecraft.client.data.BlockStateModelGenerator`） |
| `ModelTemplates` | `Models` | 1.16.5–1.21.11 | join（`net.minecraft.client.data.Models`） |
| `StateDefinition` | `StateManager` | 1.16.5–1.21.11 | join（`net.minecraft.state.StateManager`） |

- 上表「Yarn 对应名」只由本档 `mappings/yarn-mappings.sqlite` 证实**类名存在与其包路径**，**不证实**方法名、参数与返回值。逐签名以 Yarn 源码为准：`get_minecraft_source`（需 JDK 17+）或 IDE `./gradlew genSources`。
- 反过来，mojmap 侧这些名在本档 Yarn 映射里 **0 命中** ⇒ 抄进 Yarn 工程必编译失败。
- 未列入上表的 `Fabric API` / `Mixin` / 示例工程自造类名不在 vanilla 映射内，按语料原样用。

## 本档未覆盖（禁止默写）

- **`multipart` 形式的 blockstate**：本档四个页面与全部参考 JSON 只出现 `variants`，`multipart` 一次都没有 ⇒ 不许凭记忆写其键名。
- **JSON 层 `uvlock` 的确切写法**：只在 datagen 页以「rotation, uvlock 选项」的中文式提及出现，JSON 里未给出 ⇒ `TODO(未核实)`。
- **模型 JSON 的版本变更史**（哪个字段何时加入 / 废弃）：本档无对照表 ⇒ 不写。
- **`BlockColors` / 染色注册入口**：block-models 页仅在 `tintindex` 一句里提到 `BlockColors`，没有注册代码 ⇒ 需要时读同档 `develop_data-generation_block-models.md` 之外的页（如 tinting 相关页）**现读现抄**，本档 corpus 是否含该页未逐一核对 ⇒ 不写。
- **item model 的 select / property DSL 全貌**：参考文件里出现 `ItemModelUtils.select/when/rangeSelect/composite/plainModel`、`ItemModel.Unbaked`、`ContextDimension`、`Count`，但对应章节正文未在本次读取范围内展开 ⇒ 需要时读 `fabric-docs/1.21.11/processed/develop_data-generation_item-models.md`（已在盘上）后再写。
- **`generate_model` MCP 工具**：只吐文本骨架，其参数面不校验本档模型字段；不要拿它当本档正文的替代。

## 相关

- 方块与属性：`02-block.mdc` / `mc-block`；注册：`01-registry.mdc` / `mc-registry`
- 数据生成接线：`07-datagen.mdc` / `mc-datagen`；物品模型：`03-item.mdc` / `mc-item`
- 客户端 / 服务端分离：`08-client-server.mdc`（datagen provider 在 client source set）
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_blocks_block-models")` / `id="develop_blocks_blockstates"` / `id="develop_items_item-models"` / `id="develop_data-generation_block-models"`
