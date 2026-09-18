---
title: "IMessageHandler"
description: "A message handler based on IMessage . Implement and override onMessage(IMessage, MessageContext) to process your packet. Supply the class to SimpleNetworkWrapper.registerMessage(Class, Class, int, net"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/network/simpleimpl/IMessageHandler.html"
sourceType: javadoc
---

# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage ,REPLY extends IMessage >
```

## Methods

- `REPLY onMessage( REQ message, MessageContext ctx)`

## Description

A message handler based on IMessage . Implement and override onMessage(IMessage, MessageContext) to process your packet. Supply the class to SimpleNetworkWrapper.registerMessage(Class, Class, int, net
