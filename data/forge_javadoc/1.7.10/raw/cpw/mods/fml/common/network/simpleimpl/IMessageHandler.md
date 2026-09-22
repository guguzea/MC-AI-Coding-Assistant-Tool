---
title: "IMessageHandler"
description: "public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>"
package: "cpw/mods/fml/common/network/simpleimpl"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/network/simpleimpl/IMessageHandler.html"
sourceType: javadoc
---

# IMessageHandler

## Class signature

```java
public interface IMessageHandler<REQ extends IMessage, REPLY extends IMessage>
```

## Methods

- `REPLY onMessage(REQ message, MessageContext ctx)` — Called when a message is received of the appropriate type.
