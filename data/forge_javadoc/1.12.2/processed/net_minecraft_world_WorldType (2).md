# WorldType

## Class signature

```java
public class WorldType extends java.lang.Object
```

## Constructors

- `public WorldType(java.lang.String name)`

## Methods

- `public java.lang.String getName()`
- `public java.lang.String getTranslationKey()`
- `public java.lang.String getInfoTranslationKey()`
- `public int getVersion()`
- `public WorldType getWorldTypeForGeneratorVersion(int version)`
- `public boolean canBeCreated()`
- `public boolean isVersioned()`
- `public static WorldType parseWorldType(java.lang.String type)`
- `public int getId()`
- `public boolean hasInfoNotice()`
- `public BiomeProvider getBiomeProvider( World world)`
- `public IChunkGenerator getChunkGenerator( World world, java.lang.String generatorOptions)`
- `public int getMinimumSpawnHeight( World world)`
- `public double getHorizon( World world)`
- `public double voidFadeMagnitude()`
- `public boolean handleSlimeSpawnReduction(java.util.Random random, World world)`
- `public void onGUICreateWorldPress()`
- `public int getSpawnFuzz( WorldServer world, MinecraftServer server)`
- `public void onCustomizeButton( Minecraft mc, GuiCreateWorld guiCreateWorld)`
- `public boolean isCustomizable()`
- `public float getCloudHeight()`
- `public GenLayer getBiomeLayer(long worldSeed, GenLayer parentLayer, ChunkGeneratorSettings chunkSettings)`

## Description

Creates a new world type, the ID is hidden and should not be referenced by modders.