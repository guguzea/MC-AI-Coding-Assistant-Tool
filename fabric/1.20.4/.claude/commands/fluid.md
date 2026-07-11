# Fabric 流体开发命令参考

本文件描述 Fabric 1.20.4 平台上进行流体（Fluid）开发时所需掌握的核心 API 和常用命令。

## 核心概念

流体是 Minecraft 中表示液体和气体的特殊方块/实体组合。每个流体由两个部分组成：`Fluid`（流体属性和逻辑）和 `FluidType`（流体类型的定义，如水、岩浆）。与 Forge 中使用 `Fluid` 类直接继承不同，Fabric 1.20.x 采用更模块化的设计，将流体属性（`FluidType`）与流体实例（`Fluid`）分离。

## FluidType 注册命令

### FluidType 创建命令

`FluidType` 定义流体的基本属性，如材质、渲染方式、声音等。创建自定义 `FluidType`：

```java
public class MyFluidType extends FluidType {
    public MyFluidType(Settings settings) {
        super(settings);
    }
    
    // 可选：重写方法自定义行为
}
```

### FluidType.Settings 配置命令

`FluidType` 使用 `FluidType.Settings` 配置属性：

```java
new FluidType(Settings.create()
    .density(1000)           // 密度（水的密度是1000）
    .temperature(300)        // 温度（绝对温度）
    .luminosity(0)           // 发光等级（水的发光等级是0）
    .viscosity(5)            // 粘度（水的粘度是5）
    .compressible()          // 是否可压缩
    .supportsBoating()       // 是否支持乘船
    .sound(EmptyFluidSound.INSTANCE)  // 流体声音
)
```

密度影响流体流动速度和方向（密度大的向下流）。粘度影响流体流动距离，粘度越高流动越慢。

### FluidType 注册命令

`FluidType` 通过 `Registries.FLUID_TYPE` 注册：

```java
private static final RegistrySupplier<FluidType> MY_FLUID_TYPE = 
    Registry.register(
        Registries.FLUID_TYPE,
        new Identifier(MOD_ID, "my_fluid_type"),
        new MyFluidType(Settings.create().density(800).viscosity(3))
    );
```

## StillFluid 和 FlowingFluid 命令

### 流体实例创建命令

每个 `FluidType` 需要两个 `Fluid` 实例：静止状态（`still`）和流动状态（`flowing`）：

```java
// 静止流体（无限源）
private static final RegistrySupplier<Fluid> MY_FLUID = 
    Registry.register(
        Registries.FLUID,
        new Identifier(MOD_ID, "my_fluid"),
        new StillFluid(MY_FLUID_TYPE.get(), FabricFluidAttributes.builder(
            new Identifier("minecraft", "block/water_still"),
            new Identifier("minecraft", "block/water_flow")
        ))
    );

// 流动流体
private static final RegistrySupplier<Fluid> FLOWING_MY_FLUID = 
    Registry.register(
        Registries.FLUID,
        new Identifier(MOD_ID, "flowing_my_fluid"),
        new FlowingFluid(MY_FLUID_TYPE.get(), FabricFluidAttributes.builder(
            new Identifier("minecraft", "block/water_still"),
            new Identifier("minecraft", "block/water_flow")
        ))
    );
```

### FabricFluidAttributes 命令

`FabricFluidAttributes` 用于配置流体的视觉属性：

```java
FabricFluidAttributes.builder(
    stillTexture,   // 静止状态纹理
    flowingTexture  // 流动状态纹理
)
.bucketTexture(new Identifier(MOD_ID, "item/my_fluid_bucket"))
.overlayTexture(new Identifier(MOD_ID, "block/my_fluid_overlay"))
.block(MY_FLUID_BLOCK)  // 关联的方块
.source(MY_FLUID)       // 源方块
.build()
```

## 流体方块命令

### FluidBlock 创建命令

流体在世界中以方块形式存在，需要创建 `FluidBlock` 或使用 `FluidBlock` 的子类：

```java
private static final RegistrySupplier<FluidBlock> MY_FLUID_BLOCK = 
    Registry.register(
        Registries.BLOCK,
        new Identifier(MOD_ID, "my_fluid_block"),
        new FluidBlock(MY_FLUID, AbstractBlock.Settings.create()
            .noCollision()
            .strength(100.0f)
            .dropsNothing()
            .liquid()
            .sounds(BlockSoundGroup.GRAVEL))  // 流体声音
    );
```

`FluidBlock` 构造函数第一个参数是流体实例。`liquid()` 设置方块为流体类型。

### 流体方块属性命令

`AbstractBlock.Settings` 中与流体相关的属性：

```java
AbstractBlock.Settings.create()
    .noCollision()           // 无碰撞体积
    .strength(100.0f)        // 不可挖掘（设为100防止被破坏）
    .dropsNothing()          // 破坏不掉落物品
    .liquid()                // 标记为液体
    .sounds(BlockSoundGroup.SLIME)  // 流体声音
    .nonOpaque()             // 半透明
```

## 流体桶命令

### FluidBucketItem 创建命令

创建流体桶物品：

```java
private static final RegistrySupplier<FluidBucketItem> MY_FLUID_BUCKET = 
    Registry.register(
        Registries.ITEM,
        new Identifier(MOD_ID, "my_fluid_bucket"),
        new FluidBucketItem(
            MY_FLUID,                    // 桶中的流体
            new Item.Settings()
                .maxCount(1)
                .recipeRemainder(Items.BUCKET),  // 使用后剩余空桶
                .group(ItemGroup.MISC)
        )
    );
```

### 桶物品配方命令

流体桶需要合成配方。使用数据生成器：

```java
// 生成填充配方（空桶 -> 流体桶）
桶 + 流体源 -> 流体桶

// 生成倒出配方（流体桶 -> 空桶）
流体桶 -> 空桶 + 流体
```

## 渲染配置命令

### 流体渲染属性命令

`FabricFluidRenderingExtensions` 可以自定义流体渲染：

```java
// 在客户端入口点配置
public class ExampleModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        FluidRegistryEvents.registerFluidRendering(
            MY_FLUID,
            MY_FLUID_TYPE,
            new Identifier(MOD_ID, "block/my_fluid_still"),
            new Identifier(MOD_ID, "block/my_fluid_flow"),
            new Identifier(MOD_ID, "block/my_fluid_overlay")
        );
    }
}
```

### 流体着色器命令

对于更高级的流体渲染（如粘性流体、熔岩效果），需要使用自定义着色器。将 GLSL 着色器文件放在 `src/main/resources/assets/{modid}/shaders/` 目录，并在 `fabric.mod.json` 中声明着色器资源。

## 流体交互命令

### 流体状态效果命令

可以通过 Mixin 修改流体的行为。例如，让玩家进入流体时获得状态效果：

```java
@Mixin(PlayerEntity.class)
public class PlayerEntityFluidMixin {
    @Inject(method = "updateStates", at = @At("TAIL"))
    private void onUpdateStates(CallbackInfo ci) {
        PlayerEntity player = (PlayerEntity)(Object)this;
        if (player.isInFluid(FluidTags.MYCUSTOMFLUID)) {
            player.addStatusEffect(new StatusEffectInstance(
                StatusEffects.SPEED, 100, 1));
        }
    }
}
```

### FluidTags 使用命令

`FluidTags` 用于识别特定类型的流体：`FluidTags.WATER`（水），`FluidTags.LAVA`（岩浆），`FluidTags.MILK`（牛奶）。自定义流体标签需要在数据生成器中创建 `data/{modid}/tags/fluid/{tag_name}.json` 文件。

## 完整示例命令

完整创建一个自定义流体的步骤：

1. 创建 `FluidType` 并注册
2. 创建 `StillFluid` 和 `FlowingFluid` 实例并注册
3. 创建 `FluidBlock` 并注册
4. 创建 `FluidBucketItem` 并注册
5. 在客户端配置渲染属性
6. 添加桶的合成配方（通过数据生成器）

整个流程需要协调服务端和客户端代码，确保两端注册一致。资源文件（纹理、模型）需要放在正确的 `assets/{modid}/` 目录下。
