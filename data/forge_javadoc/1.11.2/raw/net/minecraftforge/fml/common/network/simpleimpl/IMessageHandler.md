---
title: "IMessageHandler"
description: "public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>"
package: "net/minecraftforge/fml/common/network/simpleimpl"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/network/simpleimpl/IMessageHandler.html"
sourceType: javadoc
---

# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>
```

## Methods

- `REPLY onMessage(REQ message, MessageContext ctx)` — Called when a message is received of the appropriate type.
