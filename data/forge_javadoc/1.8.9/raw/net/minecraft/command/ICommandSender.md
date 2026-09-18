---
title: "ICommandSender"
description: "Send a chat message to the CommandSender"
package: "net/minecraft/command"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/ICommandSender.html"
sourceType: javadoc
---

# ICommandSender

## Class signature

```java
public interface ICommandSender
```

## Methods

- `java.lang.String getName()`
- `IChatComponent getDisplayName()`
- `void addChatMessage( IChatComponent component)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `BlockPos getPosition()`
- `Vec3 getPositionVector()`
- `World getEntityWorld()`
- `Entity getCommandSenderEntity()`
- `boolean sendCommandFeedback()`
- `void setCommandStat( CommandResultStats.Type type, int amount)`

## Description

Send a chat message to the CommandSender
