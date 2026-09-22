---
title: "ClientChatReceivedEvent"
description: "public class ClientChatReceivedEvent extends Event"
package: "net/minecraftforge/client/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/event/ClientChatReceivedEvent.html"
sourceType: javadoc
---

# ClientChatReceivedEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.client.event.ClientChatReceivedEvent

## Class signature

```java
public class ClientChatReceivedEvent extends Event
```

## Constructors

- `ClientChatReceivedEvent(byte type, ITextComponent message)`

## Methods

- `ITextComponent getMessage()`
- `byte getType()` — Introduced in 1.8: 0 : Standard Text Message 1 : 'System' message, displayed as standard text. 2 : 'Status' message, displayed above action bar, where song notifications are.
- `void setMessage(ITextComponent message)`
