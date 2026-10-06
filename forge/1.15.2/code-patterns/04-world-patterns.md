# 世界相关模式（Forge 1.15.2）

## 自定义生物群系

```java
// 注册
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        .temperature(0.8f)
        .downfall(0.4f)
        .scale(0.2f)
        .depth(0.1f)
        .category(Biome.Category.PLAINS)
        .precipitation(Biome.RainType.RAIN)
        // official 构件实证（javap @1.15.2 official，2026-10-05）：SurfaceBuilder 为抽象类（公开实例 = static 常量 DEFAULT 等），
        // 配置类 = SurfaceBuilderConfig（❌ DefaultSurfaceConfig = MCP 层名）；Builder 方法只有 temperature/downfall（无 withX 前缀）。
        .surfaceBuilder(SurfaceBuilder.DEFAULT, new SurfaceBuilderConfig(
            Blocks.GRASS_BLOCK.defaultBlockState(),
            Blocks.DIRT.defaultBlockState(),
            Blocks.GRAVEL.defaultBlockState()
        ))
        .mobSpawnGroup(...) // TODO(未核实)：152 official Biome.Builder 的 mob spawn / features 方法名本轮未取证
        .build()
);
```

## 自定义结构

```java
// 1.15.2 中结构需要使用 Forge 的 Structure 类或自定义生成器
// 参考 Forge 源码和社区教程进行结构生成
```
