---
title: "IMessageHandler"
description: "A message handler based on IMessage . Implement and override #onMessage(IMessage) to process your packet. Supply the class to SimpleNetworkWrapper#registerMessage(Class, Class, byte, cpw.mods.fml.rela"
package: "cpw/mods/fml/common/network/simpleimpl"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/simpleimpl/IMessageHandler.html"
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

A message handler based on IMessage . Implement and override #onMessage(IMessage) to process your packet. Supply the class to SimpleNetworkWrapper#registerMessage(Class, Class, byte, cpw.mods.fml.rela
