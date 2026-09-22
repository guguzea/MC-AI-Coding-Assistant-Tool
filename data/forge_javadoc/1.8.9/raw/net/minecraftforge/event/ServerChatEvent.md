---
title: "ServerChatEvent"
description: "public class ServerChatEvent extends Event"
package: "net/minecraftforge/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/ServerChatEvent.html"
sourceType: javadoc
---

# ServerChatEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `ServerChatEvent(EntityPlayerMP player, java.lang.String message, ChatComponentTranslation component)`

## Methods

- `IChatComponent getComponent()`
- `void setComponent(IChatComponent e)`

## Fields

- `ChatComponentTranslation component`
- `java.lang.String message`
- `EntityPlayerMP player`
- `java.lang.String username`
