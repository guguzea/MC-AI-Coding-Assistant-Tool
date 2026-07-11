# 世界相关模式（Forge 1.14.4）

## 自定义生物群系

```java
// 注册（使用 DeferredRegister）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        .temperature(0.8f)
        .precipitation(Biome.RainType.NONE)
        .downfall(0.4f)
        .category(Biome.Category.PLAINS)
        .depth(0.125f)
        .scale(0.05f)
        .specialEffects(new BiomeAmbience.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColor(0x7ed957)
            .foliageColor(0x60bd3f)
            .ambientSound(AmbientManager.LEGACY_CAVE)
            .build())
        .generationSettings(...)
        .mobSettings(...)
        .build()
);

// 在 RegistryEvent.Register<Biome> 中注册
```
