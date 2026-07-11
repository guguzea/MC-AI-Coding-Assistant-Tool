# 世界相关模式（Forge 1.18.2）

```yaml
模式: 世界生成/地形
分类: world
```

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

## 1.18.2 世界高度

```java
// Caves & Cliffs 更新后的世界高度
int minBuildHeight = world.getMinBuildHeight();  // -64
int maxBuildHeight = world.getMaxBuildHeight();  // 320

// 世界高度范围
LevelHeightAccessor accessor = level;
int worldHeight = accessor.getHeight();  // 384 (-64 to 320)

// 地下深度
int minY = accessor.getMinBuildHeight();  // -64
```

## 自定义结构

```java
public class MyStructure extends Structure.StructureSettings {
    // 继承 StructureSettings 配置生成参数
}
```
