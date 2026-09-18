---
title: "IMessageHandler"
description: "A message handler based on IMessage . Implement and override #onMessage(IMessage) to process your packet. Supply the class to SimpleNetworkWrapper#registerMessage(Class, Class, byte, net.minecraftforg"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/simpleimpl/IMessageHandler.html"
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

A message handler based on IMessage . Implement and override #onMessage(IMessage) to process your packet. Supply the class to SimpleNetworkWrapper#registerMessage(Class, Class, byte, net.minecraftforg
