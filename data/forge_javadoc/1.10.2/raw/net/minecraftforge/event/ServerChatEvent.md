---
title: "ServerChatEvent"
description: "ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks.onServerChatEvent(NetHandlerPlayServer, String, ITextComponent) , which is executed by the Net"
package: "net/minecraftforge/event"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/ServerChatEvent.html"
sourceType: javadoc
---

# ServerChatEvent

## Class signature

```java
public class ServerChatEvent extends Event
```

## Constructors

- `public ServerChatEvent( EntityPlayerMP player, java.lang.String message, ITextComponent component)`

## Methods

- `public void setComponent( ITextComponent e)`
- `public ITextComponent getComponent()`
- `public java.lang.String getMessage()`
- `public java.lang.String getUsername()`
- `public EntityPlayerMP getPlayer()`

## Description

ServerChatEvent is fired whenever a C01PacketChatMessage is processed. This event is fired via ForgeHooks.onServerChatEvent(NetHandlerPlayServer, String, ITextComponent) , which is executed by the Net
