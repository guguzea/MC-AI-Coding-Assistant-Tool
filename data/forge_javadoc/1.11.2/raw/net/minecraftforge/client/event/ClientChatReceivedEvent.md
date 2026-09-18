---
title: "ClientChatReceivedEvent"
description: "Introduced in 1.8: 0 : Standard Text Message 1 : 'System' message, displayed as standard text. 2 : 'Status' message, displayed above action bar, where song notifications are."
package: "net/minecraftforge/client/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/client/event/ClientChatReceivedEvent.html"
sourceType: javadoc
---

# ClientChatReceivedEvent

## Class signature

```java
public class ClientChatReceivedEvent extends Event
```

## Constructors

- `public ClientChatReceivedEvent(byte type, ITextComponent message)`

## Methods

- `public ITextComponent getMessage()`
- `public void setMessage( ITextComponent message)`
- `public byte getType()`

## Description

Introduced in 1.8: 0 : Standard Text Message 1 : 'System' message, displayed as standard text. 2 : 'Status' message, displayed above action bar, where song notifications are.
