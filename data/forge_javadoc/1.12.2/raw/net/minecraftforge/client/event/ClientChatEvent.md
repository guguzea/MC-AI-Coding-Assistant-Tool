---
title: "ClientChatEvent"
description: "ClientChatEvent is fired whenever the client is about to send a chat message or command to the server. This event is fired via ForgeEventFactory.onClientSendMessage(String) , which is executed by GuiS"
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/ClientChatEvent.html"
sourceType: javadoc
---

# ClientChatEvent

## Class signature

```java
public class ClientChatEvent extends Event
```

## Constructors

- `public ClientChatEvent(java.lang.String message)`

## Methods

- `public java.lang.String getMessage()`
- `public void setMessage(java.lang.String message)`
- `public java.lang.String getOriginalMessage()`

## Description

ClientChatEvent is fired whenever the client is about to send a chat message or command to the server. This event is fired via ForgeEventFactory.onClientSendMessage(String) , which is executed by GuiS
