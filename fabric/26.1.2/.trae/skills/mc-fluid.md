---
name: mc-fluid
description: Fabric 26.1.2 mc-fluid。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# mc-fluid（Fabric 26.1.2）

本档是**去混淆档**：游戏 jar 即 Mojang official 名，没有 yarn 映射轴（禁止按 1.21.x 的 Yarn 名写流体）。
下列写法全部取本档语料**逐字出处**（2026-10-05 核）：

- `data/fabric_26.1.2/fabric-docs/26.1.2/processed/develop_fluids_first-fluid.md`（官方「Creating Your First Fluid」页）
- `data/fabric_26.1.2/reference/26.1.2/src/main/java/com/example/docs/fluid/custom/AcidFluid.java`（extends FlowingFluid，嵌套 Source / Flowing）
- `data/fabric_26.1.2/reference/26.1.2/src/main/java/com/example/docs/fluid/ModFluids.java`（BuiltInRegistries.FLUID 注册）
- `data/fabric_26.1.2/reference/26.1.2/src/client/java/com/example/docs/appearance/ExampleModAppearanceClient.java`（FluidRenderingRegistry.register + FluidModel.Unbaked）

> **更正注记（2026-10-05）**：旧 yarn 档流传的 `FabricFlowableFluid` / `FlowableFluid.Settings` / `slopeFindDistance` / `supportsBoating` / `StillFluid` 一族在本档语料与 Fabric API 真构件 roster（26.1.2）里**零命中**，是虚构名，禁止输出；本档没有 yarn 轴，`FlowableFluid` 这类 Yarn 名也不许照搬（本档基类 = **FlowingFluid**）。同理 1.21.x 的 `FluidRenderHandlerRegistry.INSTANCE` 在 26.1.2 构件已移除（本档 FAPI = `FluidRenderingRegistry` 静态入口）——不得照 1.21.x 抄。
> **映射口径**：本档为去混淆档，official（mojmap 层）名就是基线——`Registry` / `BuiltInRegistries` / `Identifier.fromNamespaceAndPath` / `getSource` / `Material` / `BlockTintSources` 等全部按本档语料逐字取用（参考件 + 官方页），不存在「回 Yarn 名换写」的问题，但也不得反向把 1.21.x 的 Yarn 名当本档名。

## 快速开始

```java
// 流体基类 = net.minecraft.world.level.material.FlowingFluid（本档参考件 AcidFluid.java 逐字）
public abstract class AcidFluid extends FlowingFluid {

    @Override
    public Fluid getSource() { return ModFluids.ACID_STILL; }

    @Override
    public Fluid getFlowing() { return ModFluids.ACID_FLOWING; }
    // 其余 override（isSame / getBucket / createLegacyBlock / getTickDelay / canBeReplacedWith / animateTick 一族）
    // 逐字见参考件 AcidFluid.java，按需抄那个文件，不要凭记忆补

    public static class Source extends AcidFluid { }

    public static class Flowing extends AcidFluid { }
}

// 注册（本档参考件 ModFluids.java 形状：Registry.register + BuiltInRegistries.FLUID + Identifier.fromNamespaceAndPath）
public class ModFluids {
    public static final FlowingFluid ACID_STILL = register("acid", new AcidFluid.Source());
    public static final FlowingFluid ACID_FLOWING = register("flowing_acid", new AcidFluid.Flowing());

    private static FlowingFluid register(String name, FlowingFluid fluid) {
        return Registry.register(BuiltInRegistries.FLUID, Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, name), fluid);
    }

    public static void initialize() {
    }
}
```

## Decision: 选择流体类型

```
IF 可流动的液体
  → 继承本档 official 基类 FlowingFluid（参考件 AcidFluid.java 逐字）

IF 需要「静止/流动」成对形态
  → 照参考件写两个嵌套子类 Source / Flowing（StillFluid 这名字在本档语料零命中，禁止写）

IF 流体要出现在世界里
  → 还要注册对应液体方块 LiquidBlock 与桶 BucketItem（参考件 ModBlocks.java / ModItems.java 逐字）
```

## 渲染（客户端，本档 Fabric API 真构件）

```java
// 本档 FAPI 流体纹理入口 = FluidRenderingRegistry（静态 register；出处 ExampleModAppearanceClient.java 逐字）
// 构造参数表照该参考件抄（still / flowing / overlay Material + BlockTintSources.constant(ARGB.opaque(...))）
FluidRenderingRegistry.register(
        ModFluids.ACID_STILL,
        ModFluids.ACID_FLOWING,
        new FluidModel.Unbaked(
                new Material(Identifier.withDefaultNamespace("block/water_still")),
                new Material(Identifier.withDefaultNamespace("block/water_flow")),
                new Material(Identifier.withDefaultNamespace("block/water_overlay")),
                BlockTintSources.constant(ARGB.opaque(0x075800))
        )
);
```

## 常见错误

- ❌ 把 `FabricFlowableFluid.Settings` builder 链当注册方式 — 本档语料与 FAPI 构件零命中，不可写
- ❌ 用 Yarn 名 `FlowableFluid` / `Identifier.of` 等 1.21.x 轴写法 — 本档去混淆，按 official 名与参考件形状写
- ❌ 照抄 1.21.x 的 `FluidRenderHandlerRegistry.INSTANCE` — 26.1.2 构件已换成 FluidRenderingRegistry
- ❌ 忘记注册 Fluid 和对应的方块 — 流体不显示
- ❌ Fluid 和 Block 使用不同 ID — 状态映射失败

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-registry` | 流体通过 Registry.register() 注册（本档 = BuiltInRegistries.FLUID） |
| `mc-block` | 流体需要对应的液体方块（LiquidBlock）才能进入世界 |
| `mc-item` | 通常再配一个 BucketItem 桶物品（参考件 ModItems.java） |

核不到的签名改口：`search_fabric_docs`（version=26.1.2）；仍核不到就停，禁止臆造。
