# 世界相关模式（Forge 1.20.1）

## 自定义生物群系

```java
// 注册（使用 Vanilla Registry）
public static final DeferredRegister<Biome> BIOMES =
    DeferredRegister.create(Registries.BIOME, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.BiomeBuilder()
        .temperature(0.8f)
        .downfall(0.4f)
        .specialEffects(new BiomeSpecialEffects.Builder()
            .waterColor(0x3f76e4)
            .waterFogColor(0x50533)
            .skyColor(0x78a9ff)
            .grassColor(0x7ed957)
            .foliageColor(0x60bd3f)
            .ambientMoodSound(AmbientMoodSettings.LEGACY_CAVE)
            .build())
        .generationSettings(...)
        .mobSettings(...)
        .build()
);
```

## 自定义结构

```java
public class MyStructure extends Structure.StructureSettings {
    // 继承 StructureSettings 配置生成参数
}
```
