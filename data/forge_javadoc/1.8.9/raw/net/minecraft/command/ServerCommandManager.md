---
title: "ServerCommandManager"
description: "public class ServerCommandManager extends CommandHandler implements IAdminCommand"
package: "net/minecraft/command"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/command/ServerCommandManager.html"
sourceType: javadoc
---

# ServerCommandManager

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler → net.minecraft.command.ServerCommandManager

## Class signature

```java
public class ServerCommandManager extends CommandHandler implements IAdminCommand
```

## Constructors

- `ServerCommandManager()`

## Methods

- `void notifyOperators(ICommandSender sender, ICommand command, int flags, java.lang.String msgFormat, java.lang.Object... msgParams)` — Send an informative message to the server operators
