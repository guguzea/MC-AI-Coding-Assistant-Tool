---
title: "NetworkRegistry"
description: "Represents a target point for the ALLROUNDPOINT target."
package: "cpw/mods/fml/common/network"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/NetworkRegistry.html"
sourceType: javadoc
---

# NetworkRegistry

## Class signature

```java
public enum NetworkRegistry extends java.lang.Enum< NetworkRegistry >
```

## Methods

- `public static NetworkRegistry [] values()`
- `public static NetworkRegistry valueOf(java.lang.String name)`
- `public java.util.EnumMap< Side , FMLEmbeddedChannel > newChannel(java.lang.String name, ChannelHandler... handlers)`
- `public SimpleNetworkWrapper newSimpleChannel(java.lang.String name)`
- `public FMLEventChannel newEventDrivenChannel(java.lang.String name)`
- `public java.util.EnumMap< Side , FMLEmbeddedChannel > newChannel( ModContainer container, java.lang.String name, ChannelHandler... handlers)`
- `public FMLEmbeddedChannel getChannel(java.lang.String name, Side source)`
- `public void registerGuiHandler(java.lang.Object mod, IGuiHandler handler)`
- `public Container getRemoteGuiContainer( ModContainer mc, EntityPlayerMP player, int modGuiId, World world, int x, int y, int z)`
- `public java.lang.Object getLocalGuiContainer( ModContainer mc, EntityPlayer player, int modGuiId, World world, int x, int y, int z)`
- `public boolean hasChannel(java.lang.String channelName, Side source)`
- `public void register( ModContainer fmlModContainer, java.lang.Class<?> clazz, java.lang.String remoteVersionRange, ASMDataTable asmHarvestedData)`
- `public boolean isVanillaAccepted( Side from)`
- `public java.util.Map< ModContainer , NetworkModHolder > registry()`
- `public java.util.Set<java.lang.String> channelNamesFor( Side side)`
- `public void fireNetworkHandshake( NetworkDispatcher networkDispatcher, Side origin)`

## Description

Represents a target point for the ALLROUNDPOINT target.
