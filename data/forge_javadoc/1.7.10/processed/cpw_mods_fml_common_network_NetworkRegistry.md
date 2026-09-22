# NetworkRegistry

**Inheritance:** java.lang.Object → java.lang.Enum<NetworkRegistry> → cpw.mods.fml.common.network.NetworkRegistry

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
- `java.util.EnumMap<Side, FMLEmbeddedChannel> newChannel(ModContainer container, java.lang.String name, ChannelHandler... handlers)` — INTERNAL Create a new channel pair with the specified name and channel handlers.
- `java.util.EnumMap<Side, FMLEmbeddedChannel> newChannel(java.lang.String name, ChannelHandler... handlers)` — Create a new synchronous message channel pair based on netty.
- `FMLEventChannel newEventDrivenChannel(java.lang.String name)` — Construct a new FMLEventChannel for the channel.
- `SimpleNetworkWrapper newSimpleChannel(java.lang.String name)` — Construct a new SimpleNetworkWrapper for the channel.
- `void register(ModContainer fmlModContainer, java.lang.Class<?> clazz, java.lang.String remoteVersionRange, ASMDataTable asmHarvestedData)` — INTERNAL method for registering a mod as a network capable thing
- `void registerGuiHandler(java.lang.Object mod, IGuiHandler handler)` — Register an IGuiHandler for the supplied mod object.
- `java.util.Map<ModContainer, NetworkModHolder> registry()`
- `static NetworkRegistry valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static NetworkRegistry [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `static<any> CHANNEL_SOURCE`
- `static<any> FML_CHANNEL` — Set in the ChannelHandlerContext
- `static byte FML_PROTOCOL`
- `static<any> MOD_CONTAINER`
- `static<any> NET_HANDLER`