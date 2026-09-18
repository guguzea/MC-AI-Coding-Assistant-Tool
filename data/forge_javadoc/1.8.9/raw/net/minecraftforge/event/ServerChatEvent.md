---
title: "ServerChatEvent"
description: "ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks#onServerChatEvent(net.minecraft.network.NetHandlerPlayServer, String, ChatComponentTranslation"
package: "net/minecraftforge/event"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/ServerChatEvent.html"
sourceType: javadoc
---

# ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `public ServerChatEvent( EntityPlayerMP player, java.lang.String message, ChatComponentTranslation component)`

## Methods

- `public void setComponent( IChatComponent e)`
- `public IChatComponent getComponent()`

## Description

ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks#onServerChatEvent(net.minecraft.network.NetHandlerPlayServer, String, ChatComponentTranslation
