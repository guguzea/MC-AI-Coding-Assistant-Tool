---
title: "NetworkRegistry"
description: "public enum NetworkRegistry extends java.lang.Enum<NetworkRegistry>"
package: "net/minecraftforge/fml/common/network"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/network/NetworkRegistry.html"
sourceType: javadoc
---

# NetworkRegistry

**Inheritance:** java.lang.Object → java.lang.Enum<NetworkRegistry> → net.minecraftforge.fml.common.network.NetworkRegistry

## Class signature

```java
public enum NetworkRegistry extends java.lang.Enum<NetworkRegistry>
```

## Methods

- `java.util.Set<java.lang.String> channelNamesFor(Side side)` — All the valid channel names for a side
- `void fireNetworkHandshake(NetworkDispatcher networkDispatcher, Side origin)` — INTERNAL fire a handshake to all channels
- `FMLEmbeddedChannel getChannel(java.lang.String name, Side source)`
- `java.lang.Object getLocalGuiContainer(ModContainer mc, EntityPlayer player, int modGuiId, World world, int x, int y, int z)` — INTERNAL method for accessing the Gui registry
- `Container getRemoteGuiContainer(ModContainer mc, EntityPlayerMP player, int modGuiId, World world, int x, int y, int z)` — INTERNAL method for accessing the Gui registry
- `boolean hasChannel(java.lang.String channelName, Side source)` — Is there a channel with this name on this side?
- `boolean isVanillaAccepted(Side from)`
- `java.util.EnumMap<Side, FMLEmbeddedChannel> newChannel(ModContainer container, java.lang.String name, io.netty.channel.ChannelHandler... handlers)` — INTERNAL Create a new channel pair with the specified name and channel handlers.
- `java.util.EnumMap<Side, FMLEmbeddedChannel> newChannel(java.lang.String name, io.netty.channel.ChannelHandler... handlers)` — Create a new synchronous message channel pair based on netty.
- `FMLEventChannel newEventDrivenChannel(java.lang.String name)` — Construct a new FMLEventChannel for the channel.
- `SimpleNetworkWrapper newSimpleChannel(java.lang.String name)` — Construct a new SimpleNetworkWrapper for the channel.
- `void register(ModContainer fmlModContainer, java.lang.Class<?> clazz, java.lang.String remoteVersionRange, ASMDataTable asmHarvestedData)` — INTERNAL method for registering a mod as a network capable thing
- `void registerGuiHandler(java.lang.Object mod, IGuiHandler handler)` — Register an IGuiHandler for the supplied mod object.
- `java.util.Map<ModContainer, NetworkModHolder> registry()`
- `static NetworkRegistry valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static NetworkRegistry [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `static io.netty.util.AttributeKey<Side> CHANNEL_SOURCE`
- `static io.netty.util.AttributeKey<java.lang.String> FML_CHANNEL` — Set in the ChannelHandlerContext
- `static io.netty.util.AttributeKey<java.lang.Boolean> FML_MARKER`
- `static byte FML_PROTOCOL`
- `static io.netty.util.AttributeKey<ModContainer> MOD_CONTAINER`
- `static io.netty.util.AttributeKey<INetHandler> NET_HANDLER`
