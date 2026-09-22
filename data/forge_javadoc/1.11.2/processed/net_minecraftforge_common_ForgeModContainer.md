# ForgeModContainer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.DummyModContainer → net.minecraftforge.common.ForgeModContainer

## Class signature

```java
public class ForgeModContainer extends DummyModContainer implements WorldAccessContainer
```

## Constructors

- `ForgeModContainer()`

## Methods

- `static Configuration getConfig()`
- `java.lang.Class<?> getCustomResourcePackClass()`
- `NBTTagCompound getDataForWriting(SaveHandler handler, WorldInfo info)`
- `java.lang.String getGuiClassName()`
- `static ForgeModContainer getInstance()`
- `java.util.List<java.lang.String> getOwnedPackages()`
- `java.security.cert.Certificate getSigningCertificate()`
- `java.io.File getSource()` — The location on the file system which this mod came from
- `java.net.URL getUpdateUrl()`
- `void mappingChanged(FMLModIdMappingEvent evt)`
- `void missingMapping(FMLMissingMappingsEvent event)`
- `void modConstruction(FMLConstructionEvent evt)`
- `void onAvailable(FMLLoadCompleteEvent evt)`
- `void onConfigChanged(ConfigChangedEvent.OnConfigChangedEvent event)` — By subscribing to the OnConfigChangedEvent we are able to execute code when our config screens are closed.
- `void playerLogin(PlayerEvent.PlayerLoggedInEvent event)`
- `void postInit(FMLPostInitializationEvent evt)`
- `void preInit(FMLPreInitializationEvent evt)`
- `void readData(SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase> propertyMap, NBTTagCompound tag)`
- `boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)` — Register the event bus for the mod and the controller for error handling Returns if this bus was successfully registered - disabled mods and other mods that don't need real events should return false and avoid further processing
- `void serverStarting(FMLServerStartingEvent evt)`
- `static void updateNag()`

## Fields

- `static boolean alwaysSetupTerrainOffThread`
- `static int[] blendRanges`
- `static int clumpingThreshold`
- `static boolean disableStairSlabCulling`
- `static boolean disableVersionCheck`
- `static boolean forgeLightPipelineEnabled`
- `static boolean fullBoundingBoxLadders`
- `static long java8Reminder`
- `static boolean removeErroringEntities`
- `static boolean removeErroringTileEntities`
- `static boolean replaceVanillaBucketModel`
- `static boolean shouldSortRecipies`
- `UniversalBucket universalBucket`
- `static java.lang.String VERSION_CHECK_CAT`
- `static float zombieBabyChance`
- `static double zombieSummonBaseChance`
- `static boolean zoomInMissingModelTextInGui`