---
title: "IMessageHandler"
description: "public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/network/simpleimpl/IMessageHandler.html"
sourceType: javadoc
---

# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>
```

## Methods

- `REPLY onMessage(REQ message, MessageContext ctx)` — Called when a message is received of the appropriate type.
