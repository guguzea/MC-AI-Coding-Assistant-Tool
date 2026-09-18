---
title: "SimpleNetworkWrapper"
description: "This class is a simplified netty wrapper for those not wishing to deal with the full power of netty. It provides a simple message driven system, based on a discriminator byte over the custom packet ch"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/simpleimpl/SimpleNetworkWrapper.html"
sourceType: javadoc
---

# SimpleNetworkWrapper

## Class signature

```java
public class SimpleNetworkWrapper extends java.lang.Object
```

## Constructors

- `public SimpleNetworkWrapper(java.lang.String channelName)`

## Methods

- `public <REQ extends IMessage ,REPLY extends IMessage > void registerMessage(java.lang.Class<? extends IMessageHandler <REQ,REPLY>> messageHandler, java.lang.Class<REQ> requestMessageType, int discriminator, Side side)`
- `public <REQ extends IMessage ,REPLY extends IMessage > void registerMessage( IMessageHandler <? super REQ,? extends REPLY> messageHandler, java.lang.Class<REQ> requestMessageType, int discriminator, Side side)`
- `public Packet <?> getPacketFrom( IMessage message)`
- `public void sendToAll( IMessage message)`
- `public void sendTo( IMessage message, EntityPlayerMP player)`
- `public void sendToAllAround( IMessage message, NetworkRegistry.TargetPoint point)`
- `public void sendToDimension( IMessage message, int dimensionId)`
- `public void sendToServer( IMessage message)`

## Description

This class is a simplified netty wrapper for those not wishing to deal with the full power of netty. It provides a simple message driven system, based on a discriminator byte over the custom packet ch
