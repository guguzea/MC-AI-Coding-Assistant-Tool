# FMLEventChannel

## Class signature

```java
public class FMLEventChannel extends java.lang.Object
```

## Methods

- `public void register(java.lang.Object object)`
- `public void unregister(java.lang.Object object)`
- `public void fireUserEvent(java.lang.Object evt, ChannelHandlerContext ctx)`
- `public void sendToAll( FMLProxyPacket pkt)`
- `public void sendTo( FMLProxyPacket pkt, EntityPlayerMP player)`
- `public void sendToAllAround( FMLProxyPacket pkt, NetworkRegistry.TargetPoint point)`
- `public void sendToDimension( FMLProxyPacket pkt, int dimensionId)`
- `public void sendToServer( FMLProxyPacket pkt)`

## Description

An event driven network channel, using FMLNetworkEvent.CustomPacketEvent and FMLNetworkEvent.CustomNetworkEvent to deliver messages to an event listener. There is one "bus" for each channel, due to th