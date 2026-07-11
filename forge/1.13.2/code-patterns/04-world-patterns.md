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
public static void register() {
    MinecraftForge.ORE_GEN_BUS.register(new MyOreGenerator());
}

public class MyOreGenerator {
    @SubscribeEvent
    public void onOreGen(WorldEvent.GenerateSpawn event) {
        // 矿石生成逻辑
    }
}
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
public static final Biome MY_BIOME = new Biome.Builder()
    .precipitation(Biome.RainType.RAIN)
    .category(Biome.Category.PLAINS)
    .depth(0.125f)
    .scale(0.05f)
    .temperature(0.8f)
    .downfall(0.4f)
    .withDefaultTemperature()
    .waterColor(0x3f76e4)
    .withTemperatureBiome()
    .surfaceBuilder(new SurfaceBuilder("grass"), new SurfaceConfig(Blocks.GRASS_BLOCK.getDefaultState(), Blocks.DIRT.getDefaultState(), Blocks.GRAVEL.getDefaultState()))
    .build();

# 注册
@SubscribeEvent
public void onBiomesRegistry(RegistryEvent.Register<Biome> event) {
    event.getRegistry().register(MY_BIOME.setRegistryName(new ResourceLocation(MOD_ID, "my_biome")));
}
```
