# 世界相关模式（Forge 1.16.5）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        // 1.16.2+ 地表配置已迁到 BiomeGenerationSettings（Biome$Builder 上没有 surfaceBuilder）
        .precipitation(Biome.RainType.RAIN)
        .biomeCategory(Biome.Category.PLAINS)   // 1.16.5 实测：方法名是 biomeCategory
        .depth(0.125f)
        .scale(0.05f)
        .temperature(0.8f)
        .downfall(0.4f)
        .specialEffects(new BiomeAmbience.Builder()   // 1.16.5 实测：不是 withEffects
        .waterColor(0x3f76e4)                          // 不是 setWaterColor
        .waterFogColor(0x50533)                        // 不是 setWaterFogColor
        .fogColor(0xc0d8ff)                            // 不是 withFogColor
        .skyColor(0x78a9ff)                            // 不是 withSkyColor
        .ambientLoopSound(SoundEvents.AMBIENT_BASALT_DELTAS_LOOP)  // 不是 setAmbientSound(AmbientSoundEvents.…)
        .build())
        .mobSpawnSettings(MobSpawnInfo.builder().build())            // 不是 withMobSpawnSettings(consumer)
        .generationSettings(BiomeGenerationSettings.builder().build())  // 不是 withGenerationSettings(consumer)
        .build()
);
```

## 自定义结构

```java
public class MyStructure extends Structure<MyStructureConfig> {
    // 继承 Structure 配置生成参数
}
```
