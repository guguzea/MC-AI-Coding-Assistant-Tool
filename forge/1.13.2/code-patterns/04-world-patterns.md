# 世界生成模式（Forge 1.13.2）

## 模式: Ore Generation

```yaml
模式: Ore Generation
版本: Forge 1.13.2
平台: Forge
分类: world
依赖: []
扩展点: [生物群系, 世界生成]
---
# 在 FMLCommonSetupEvent 中注册世界生成器
// 1.13.2 构件 javap：本档没有 MinecraftForge.ORE_GEN_BUS，也没有 WorldEvent.GenerateSpawn
//   （WorldEvent 的子类只有 Load / Save / Unload / PotentialSpawns / CreateSpawnPosition）。
//   1.13.2 的矿物生成挂在生物群系上：Biome#addFeature(GenerationStage.Decoration, CompositeFeature)，
//   不再有 ORE_GEN_BUS 这类事件总线。
// TODO(未核实)：Feature / Placement 的具体配置类名本档未逐一取证
// biome.addFeature(GenerationStage.Decoration.UNDERGROUND_ORES,
//     Biome.createCompositeFeature(/* Feature.ORE */, /* FeatureConfig */,
//         /* BasePlacement */, /* PlacementConfig */));
```

## 模式: Custom Biome

```yaml
模式: Custom Biome
版本: Forge 1.13.2
平台: Forge
分类: world
依赖: []
扩展点: [生物群系注册, 世界生成]
---
# 定义生物群系
// 1.13.2 构件 javap：Biome 是抽象类，构造器 protected Biome(Biome.BiomeBuilder)；
//   嵌套构建器实名 Biome.BiomeBuilder（不是 Biome.Builder），且没有 withDefaultTemperature /
//   withTemperatureBiome / build()；surfaceBuilder 只吃一个 CompositeSurfaceBuilder。
public class MyBiome extends Biome {
    public MyBiome() {
        super(new Biome.BiomeBuilder()
            .precipitation(Biome.RainType.RAIN)
            .category(Biome.Category.PLAINS)
            .depth(0.125f)
            .scale(0.05f)
            .temperature(0.8f)
            .downfall(0.4f)
            .waterColor(0x3f76e4)
            .waterFogColor(0x050533)
            .surfaceBuilder(new CompositeSurfaceBuilder<>(
                new DefaultSurfaceBuilder(),
                new SurfaceBuilderConfig(
                    Blocks.GRASS_BLOCK.getDefaultState(),
                    Blocks.DIRT.getDefaultState(),
                    Blocks.GRAVEL.getDefaultState()))));
    }
}

public static final MyBiome MY_BIOME = new MyBiome();

# 注册
@SubscribeEvent
public void onBiomesRegistry(RegistryEvent.Register<Biome> event) {
    event.getRegistry().register(MY_BIOME.setRegistryName(new ResourceLocation(MOD_ID, "my_biome")));
}
```
