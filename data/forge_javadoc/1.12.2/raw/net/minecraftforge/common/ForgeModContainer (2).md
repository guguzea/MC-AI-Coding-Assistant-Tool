---
title: "ForgeModContainer"
description: "Deprecated."
package: "net/minecraftforge/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/ForgeModContainer.html"
sourceType: javadoc
---

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
- `public void onConfigChanged( ConfigChangedEvent.OnConfigChangedEvent event)`
- `public void missingMapping( RegistryEvent.MissingMappings < Item > event)`
- `public void playerLogin( PlayerEvent.PlayerLoggedInEvent event)`
- `public boolean registerBus(EventBus bus, LoadController controller)`
- `public void modConstruction( FMLConstructionEvent evt)`
- `public void preInit( FMLPreInitializationEvent evt)`
- `public void registrItems( RegistryEvent.Register < Item > event)`
- `public void postInit( FMLPostInitializationEvent evt)`
- `public void onAvailable( FMLLoadCompleteEvent evt)`
- `public void serverStarting( FMLServerStartingEvent evt)`
- `public void serverStopping( FMLServerStoppingEvent evt)`
- `public NBTTagCompound getDataForWriting( SaveHandler handler, WorldInfo info)`
- `public void readData( SaveHandler handler, WorldInfo info, java.util.Map<java.lang.String, NBTBase > propertyMap, NBTTagCompound tag)`
- `public void mappingChanged( FMLModIdMappingEvent evt)`
- `public java.io.File getSource()`
- `public java.lang.Class<?> getCustomResourcePackClass()`
- `public java.util.List<java.lang.String> getOwnedPackages()`
- `public java.security.cert.Certificate getSigningCertificate()`
- `public java.net.URL getUpdateUrl()`

## Description

Deprecated.
