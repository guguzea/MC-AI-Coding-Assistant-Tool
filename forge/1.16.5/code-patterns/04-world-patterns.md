# 世界相关模式（Forge 1.16.5）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        .surfaceBuilder(SurfaceBuilder.DEFAULT, new SurfaceBuilderConfig(Blocks.GRASS_BLOCK.getDefaultState(),
            Blocks.DIRT.getDefaultState(), Blocks.GRAVEL.getDefaultState()))
        .precipitation(Biome.RainType.RAIN)
        .category(Biome.Category.PLAINS)
        .depth(0.125f)
        .scale(0.05f)
        .temperature(0.8f)
        .downfall(0.4f)
        .withEffects(new BiomeAmbience.Builder()
            .setWaterColor(0x3f76e4)
            .setWaterFogColor(0x50533)
            .withFogColor(0xc0d8ff)
            .withSkyColor(0x78a9ff)
            .setAmbientSound(AmbientSoundEvents.AMBIENT_BASALT_DELTAS_LAZY)
            .build())
        .withMobSpawnSettings(mobSpawn -> {})
        .withGenerationSettings(gen -> {})
        .build()
);
```

## 自定义结构

```java
public class MyStructure extends Structure<MyStructureConfig> {
    // 继承 Structure 配置生成参数
}
```
