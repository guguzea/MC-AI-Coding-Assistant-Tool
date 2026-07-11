# Fabric 方块开发命令参考

本文件描述 Fabric 1.18.2 平台上进行方块（Block）开发时所需掌握的核心 API 和常用命令。

## 核心注册命令

### Registry.register()

Fabric 中所有方块都必须通过 `Registry.register()` 方法注册到游戏注册表中。与 Forge 使用 `DeferredRegister` 和事件总线不同，Fabric 在 `onInitialize()` 方法中直接调用注册方法即可完成注册。方块注册的基本格式为：`Registry.register(Registries.BLOCK, new Identifier(MOD_ID, "block_name"), blockInstance)`。其中第一个参数指定注册表类型为 `BLOCK`，第二个参数使用 `Identifier` 构造唯一标识符，第三个参数是方块实例。注册的时机非常关键，必须在 mod 初始化阶段（`onInitialize()`）完成，否则方块不会出现在游戏中。

### Identifier 构造规范

创建 `Identifier` 时必须遵循严格的命名规范：mod ID 必须全小写且与 `fabric.mod.json` 中声明的完全一致，注册名称必须使用小写字母和下划线，禁止使用连字符（`-`）或驼峰命名。正确的示例：`new Identifier("examplemod", "my_awesome_block")`，错误的示例：`new Identifier("examplemod", "my-awesome-block")` 或 `new Identifier("examplemod", "myAwesomeBlock")`。命名不一致会导致资源定位失败，游戏中方块显示为缺失的紫色方块。

### FabricBlockSettings 配置命令

`FabricBlockSettings` 是 Fabric 提供的方块属性配置器，替代了 Forge 中复杂的多参数构造函数链。基本创建命令为 `FabricBlockSettings.create()`，然后通过链式调用配置各项属性。常用配置包括：`.strength(hardness)` 设置硬度和抗爆性（单参数时两者相同），`.strength(hardness, resistance)` 分别设置，`breakByTool(FabricToolTags.PICKAXES)` 指定可用工具类型，`.requiresTool()` 要求必须使用工具，`.breakByHand(false)` 禁止空手破坏，`.dropsLike(Blocks.STONE)` 指定掉落物，`.noCollision()` 创建无碰撞体积的方块，`.slipperiness(0.98f)` 设置摩擦系数。配置完成后传递给方块构造函数即可。

### BlockItem 关联命令

方块在世界中存在但要成为可拾取的物品，需要在 `Registries.ITEM` 中注册对应的 `BlockItem`。关键规则是 BlockItem 必须使用与方块**完全相同**的 Identifier：`Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"), new BlockItem(myBlock, new Item.Settings()))`。如果使用不同的名称，游戏中会出现方块有但无法捡起的问题。方块的物品形态和方块本体通过 registry name 自动关联。

### 方块子类定义命令

创建自定义方块需要继承 `Block` 类或更具体的子类（如 `HorizontalFacingBlock`、`PillarBlock` 等）。基本命令为 `public class MyBlock extends Block { public MyBlock(Settings settings) { super(settings); } }`。在子类中可以重写多个重要方法：`getDefaultState()` 返回默认方块状态，`getStateForNeighborUpdate()` 定义状态更新逻辑，`onUse()` 定义右键交互，`onSteppedOn()` 定义踩踏逻辑，`hasBlockEntity()` 返回 true 表示需要 BlockEntity，`createBlockEntity()` 创建 BlockEntity 实例。

### BlockEntity 存储命令

对于需要存储数据的方块（如箱子、熔炉），需要创建 BlockEntity 类并实现 `BlockEntityProvider` 接口。基本命令流程：首先创建继承 `BlockEntity` 的类，然后在对应的方块类中实现 `createBlockEntity()` 方法返回 BlockEntity 实例，最后通过 `Registry.register(Registries.BLOCK_ENTITY_TYPE, id, BlockEntityType)` 注册 BlockEntityType。BlockEntity 需要实现 `readNbt()` 和 `writeNbt()` 方法处理持久化数据，以及可选的 `tick()` 方法处理每刻逻辑。

### 方块状态（BlockState）命令

方块状态通过 `BlockState` 管理，使用 `getStateDefinition()` 定义所有可能的状态。基本命令为 `protected void appendProperties(StateManager.Builder<Block, BlockState> builder) { builder.add(PROPERTY); }`。常用属性类型包括：`Properties.HORIZONTAL_FACING`（水平朝向），`Properties.FACING`（六方向朝向），`Properties.LIT`（是否点燃），`Properties.POWERED`（是否充能）。每个属性需要定义为 `public static final BooleanProperty PROPERTY = BooleanProperty.create("property_name")`。

## 构建和测试命令

### Gradle 构建命令

Fabric 项目使用 Loom 构建系统，核心命令包括：`./gradlew build` 编译并打包模组，`./gradlew runClient` 启动开发客户端，`./gradlew runServer` 启动开发服务端，`./gradlew clean loom` 清理并重新生成 Loom 映射缓存（修改 mixin 或 mappings 后必须执行）。首次构建会下载大量依赖，耗时较长，后续构建会快很多。使用 IDE 时建议先运行 `./gradlew idea` 或 `./gradlew eclipse` 生成项目文件，然后使用 IDE 的运行配置。

## 资源文件生成命令

方块除了 Java 代码外还需要资源文件：模型 JSON 定义外观，lang 文件定义显示名称，texture 定义贴图。可使用 Loom 的数据生成器自动生成部分资源文件：添加 `modApi "net.fabricmc.fabric-api:fabric-datagen-api-v0:4.2.1+1.18.2"` 依赖，创建 `DataGeneratorInitializer` 实现类，在 `fabric.mod.json` 的 `init_data` entrypoint 中注册。运行 `./gradlew runDatagen` 生成数据文件，生成的文件位于 `src/generated/resources/` 目录，由 Loom 自动合并到最终资源包中。
