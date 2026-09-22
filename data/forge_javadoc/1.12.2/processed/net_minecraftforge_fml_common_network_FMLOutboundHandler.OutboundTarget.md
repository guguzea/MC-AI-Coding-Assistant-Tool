# FMLOutboundHandler.OutboundTarget

**Inheritance:** java.lang.Object → java.lang.Enum<FMLOutboundHandler.OutboundTarget> → net.minecraftforge.fml.common.network.FMLOutboundHandler.OutboundTarget

## Class signature

```java
public static enum FMLOutboundHandler.OutboundTarget extends java.lang.Enum<FMLOutboundHandler.OutboundTarget>
```

## Methods

- `abstract java.util.List<NetworkDispatcher> selectNetworks(java.lang.Object args, ChannelHandlerContext context, FMLProxyPacket packet)`
- `abstract void validateArgs(java.lang.Object args)`
- `static FMLOutboundHandler.OutboundTarget valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static FMLOutboundHandler.OutboundTarget [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `<any> allowed`