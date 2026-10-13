# 世界相关模式（Forge 1.14.4）

## 自定义生物群系

```java
// 注册（使用 DeferredRegister）
public static final DeferredRegister<Biome> BIOMES =
    new DeferredRegister<>(ForgeRegistries.BIOMES, MOD_ID);

public static final RegistryObject<Biome> MY_BIOME = BIOMES.register("my_biome",
    () -> new Biome.Builder()
        .temperature(0.8f)
        .precipitation(Biome.RainType.NONE)
        .downfall(0.4f)
        .category(Biome.Category.PLAINS)
        .depth(0.125f)
        .scale(0.05f)
        .waterColor(0x3f76e4)
        .waterFogColor(0x50533)
        // 1.14.4 构件 javap 实测：Biome$Builder 只有 precipitation/category/depth/scale/temperature/downfall/
        //   waterColor/waterFogColor/surfaceBuilder/parent —— 没有 skyColor/grassColor/foliageColor，也没有
        //   specialEffects/BiomeAmbience（该类 1.16.5 才出现）与 ambientSound；环境音在本档不可配置
        .surfaceBuilder(SurfaceBuilder.DEFAULT, new SurfaceBuilderConfig(
            Blocks.GRASS_BLOCK.getDefaultState(), Blocks.DIRT.getDefaultState(), Blocks.GRAVEL.getDefaultState()))   // 1.14.4 构件 javap：方法名是 getDefaultState（defaultBlockState 是 1.15+ 才改的名）
        .parent("plains")   // 1.14.4 实测：无 generationSettings/mobSettings 方法
        .build()
);

// 在 RegistryEvent.Register<Biome> 中注册
```
