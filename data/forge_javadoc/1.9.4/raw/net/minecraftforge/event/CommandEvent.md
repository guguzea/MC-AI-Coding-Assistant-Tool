---
title: "CommandEvent"
description: "public class CommandEvent extends Event"
package: "net/minecraftforge/event"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/CommandEvent.html"
sourceType: javadoc
---

# CommandEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.CommandEvent

## Class signature

```java
public class CommandEvent extends Event
```

## Constructors

- `CommandEvent(ICommand command, ICommandSender sender, java.lang.String[] parameters)`

## Methods

- `ICommand getCommand()`
- `java.lang.Throwable getException()`
- `java.lang.String[] getParameters()`
- `ICommandSender getSender()`
- `void setException(java.lang.Throwable exception)`
- `void setParameters(java.lang.String[] parameters)`
