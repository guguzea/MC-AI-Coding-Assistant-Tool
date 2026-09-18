# ForgeModContainer

## Class signature

```java
public class ForgeModContainer extends DummyModContainer implements WorldAccessContainer
```

## Constructors

- `public ForgeModContainer()`

## Methods

- `public static ForgeModContainer getInstance()`
- `public java.lang.String getGuiClassName()`
- `public static Configuration getConfig()`
- `public static void updateNag()`
- `public void onConfigChanged( ConfigChangedEvent.OnConfigChangedEvent event)`
- `public void playerLogin( PlayerEvent.PlayerLoggedInEvent event)`
- `public boolean registerBus(com.google.common.eventbus.EventBus bus, LoadController controller)`
- `public void modConstruction( FMLConstructionEvent evt)`
- `public void preInit( FMLPreInitializationEvent evt)`
- `public void postInit( FMLPostInitializationEvent evt)`
- `public void onAvailable( FMLLoadCompleteEvent evt)`
- `public void serverStarting( FMLServerStartingEvent evt)`
- `public NBTTagCompound getDataForWriting( SaveHandler handler, WorldInfo info)`
- `public void readData( SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase > propertyMap, NBTTagCompound tag)`
- `public void mappingChanged( FMLModIdMappingEvent evt)`
- `public java.io.File getSource()`
- `public java.lang.Class<?> getCustomResourcePackClass()`
- `public java.util.List<java.lang.String> getOwnedPackages()`
- `public java.security.cert.Certificate getSigningCertificate()`
- `public java.net.URL getUpdateUrl()`

## Description

The location on the file system which this mod came from