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
        .mobSpawnSettings(new MobSpawnInfo.Builder().build())       // 不是 withMobSpawnSettings(consumer)
                                                                    // 构件实证（javap @1.16.5-36.2.34_mapped_official）：MobSpawnInfo 上没有静态 builder()，只有 public 无参构造的 MobSpawnInfo$Builder
        .generationSettings(new BiomeGenerationSettings.Builder().build())  // 不是 withGenerationSettings(consumer)
                                                                    // 同上：BiomeGenerationSettings$Builder 是 public 无参构造，没有静态 builder()
        .build()
);
```

## 自定义结构

```java
public class MyStructure extends Structure<MyStructureConfig> {
    // 继承 Structure 配置生成参数
}
```
