# NetworkRegistry

## Class signature

```java
public enum NetworkRegistry extends java.lang.Enum< NetworkRegistry >
```

## Methods

- `public static NetworkRegistry [] values()`
- `public static NetworkRegistry valueOf(java.lang.String name)`
- `public java.util.EnumMap< Side , FMLEmbeddedChannel > newChannel(java.lang.String name, io.netty.channel.ChannelHandler... handlers)`
- `public SimpleNetworkWrapper newSimpleChannel(java.lang.String name)`
- `public FMLEventChannel newEventDrivenChannel(java.lang.String name)`
- `public java.util.EnumMap< Side , FMLEmbeddedChannel > newChannel( ModContainer container, java.lang.String name, io.netty.channel.ChannelHandler... handlers)`
- `public FMLEmbeddedChannel getChannel(java.lang.String name, Side source)`
- `public void registerGuiHandler(java.lang.Object mod, IGuiHandler handler)`
- `@Nullable public Container getRemoteGuiContainer( ModContainer mc, EntityPlayerMP player, int modGuiId, World world, int x, int y, int z)`
- `@Nullable public java.lang.Object getLocalGuiContainer( ModContainer mc, EntityPlayer player, int modGuiId, World world, int x, int y, int z)`
- `public boolean hasChannel(java.lang.String channelName, Side source)`
- `public void register( ModContainer fmlModContainer, java.lang.Class<?> clazz, @Nullable java.lang.String remoteVersionRange, ASMDataTable asmHarvestedData)`
- `public boolean isVanillaAccepted( Side from)`
- `public java.util.Map< ModContainer , NetworkModHolder > registry()`
- `public java.util.Set<java.lang.String> channelNamesFor( Side side)`
- `public void fireNetworkHandshake( NetworkDispatcher networkDispatcher, Side origin)`

## Description

Represents a target point for the ALLROUNDPOINT target.