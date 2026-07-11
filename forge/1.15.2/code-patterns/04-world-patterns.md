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
        .surfaceBuilder(new SurfaceBuilder("grass", new DefaultSurfaceConfig(
            Blocks.GRASS_BLOCK.getDefaultState(),
            Blocks.DIRT.getDefaultState(),
            Blocks.GRAVEL.getDefaultState()
        )))
        .withTemperature(0.8f)
        .withDownfall(0.4f)
        .withMobSpawns(...)
        .withGenerationSettings(...)
        .build()
);
```

## 自定义结构

```java
// 1.15.2 中结构需要使用 Forge 的 Structure 类或自定义生成器
// 参考 Forge 源码和社区教程进行结构生成
```
