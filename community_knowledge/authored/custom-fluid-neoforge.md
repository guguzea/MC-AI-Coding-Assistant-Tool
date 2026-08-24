---
id: authored/custom-fluid-neoforge
title: 自定义流体（FluidType + BaseFlowingFluid + 桶/方块）
tags: [fluid, FluidType, BaseFlowingFluid, bucket, LiquidBlock, neoforge, client-extension]
summary: NeoForge 流体三层：FluidType 注册（NeoForgeRegistries.FLUID_TYPES）；BaseFlowingFluid.Source/Flowing 共享 Properties（挂 block/bucket）；流体方块与桶物品；IClientFluidTypeExtensions 客户端贴图/雾色；still/flowing 双注册与 JSON 贴图。
mcHint: NeoForge 1.20.5+/26.X（26.X 分支 62-fluids 核对）；Forge 同构
sourceKind: authored
---

# 自定义流体

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `62-fluids`（MIT）核对。

## 三层结构

| 层 | 注册表 | 职责 |
|----|--------|------|
| `FluidType` | `NeoForgeRegistries.Keys.FLUID_TYPES` | 属性层：温度、密度、黏度、可否点燃、与桶交互 |
| `Fluid`（source/flowing 各一） | `BuiltInRegistries.FLUID` | 物理层：流动计算，共享一份 `BaseFlowingFluid.Properties` |
| 客户端扩展 | `IClientFluidTypeExtensions` | 贴图、雾色、overlay |

## FluidType 注册

```java
public static final DeferredRegister<FluidType> FLUID_TYPES =
    DeferredRegister.create(NeoForgeRegistries.Keys.FLUID_TYPES, MOD_ID);

public static final Supplier<FluidType> ZIRCON_WATER_TYPE = FLUID_TYPES.register("zircon_water_fluid_type",
    () -> new FluidType(FluidType.Properties.create()
        .isWaterLike(false)));   // 还有 density/viscosity/temperature 等链式项
```

## Fluid 对：Source + Flowing 共享 Properties

```java
private static final BaseFlowingFluid.Properties PROPS = new BaseFlowingFluid.Properties(
        TYPE, SOURCE_REF, FLOWING_REF)
    .slopeFindDistance(2)          // 流多远
    .levelDecreasePerBlock(1)      // 每格衰减
    .block(ModBlocks.ZIRCON_WATER_BLOCK)   // 世界里实际放置的方块
    .bucket(ModItems.ZIRCON_BUCKET);

public static final Supplier<FlowingFluid> SOURCE =
    FLUIDS.register("zircon_water_source", () -> new BaseFlowingFluid.Source(PROPS));
public static final Supplier<FlowingFluid> FLOWING =
    FLUIDS.register("zircon_water_flowing", () -> new BaseFlowingFluid.Flowing(PROPS));
```

- **必须成对注册**：`*_source` 与 `*_flowing`，缺一个数据包校验直接红。
- Properties 里 `.block(...)` 指向的方块是 **LiquidBlock 子类**：构造器接 fluid supplier、重写 `getFluid()` 返回它；再给这个方块配 blockstate/model JSON。
- `.bucket(...)` 指向桶物品：BucketItem 子类，构造器传 `(fluid, props)`；喝/装填行为由 FluidType 决定。

## 客户端视觉

```java
public static final IClientFluidTypeExtensions RENDER_PROPS = new IClientFluidTypeExtensions() {
    @Override public ResourceLocation getStillTexture() { return id("block/zircon_water_still"); }
    @Override public ResourceLocation getFlowingTexture() { return id("block/zircon_water_flow"); }
    @Override public int getTintColor() { return 0xFFFFFFFF; }
};
```

- 挂接方式：`RegisterClientExtensionsEvent`（新）或 FluidType 的 `getClientFluidTypeExtensions`；教程还演示了 `modifyFogColor` 潜水雾色。
- 贴图放 `textures/block/*_still.png / *_flow.png`；染色走 tint。

## Fabric 差异提醒

Fabric 无 FluidType 层：用原版 `FlowingFluid` 子类（重写 `getFlowing/getSource/getFillItem...` 一组方法）+ FAPI 的 `FluidVariantRendering` 做客户端渲染。**不要把 BaseFlowingFluid 抄进 Fabric 工程。**

## 排查清单

- 放出来立刻消失/不流：检查 slopeFindDistance / levelDecreasePerBlock / 方块 tick 配置。
- 桶装不了：FluidType 的 canBeFilled/canConvert 行为 + 桶 item 的 fluid 引用是否指到 SOURCE。
- 紫黑棋盘格：客户端扩展没挂上或贴图路径错。
- 数据包报 unknown fluid：source/flowing 少注册了一个。

## 不清楚时

- 教程源码（分支 `62-fluids`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- API：`search_neoforge_docs`（关键词 fluids）；1.20 Forge 用 `search_forge_docs`
