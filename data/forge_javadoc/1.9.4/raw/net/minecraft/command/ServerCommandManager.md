---
title: "ServerCommandManager"
description: "public class ServerCommandManager extends CommandHandler implements ICommandListener"
package: "net/minecraft/command"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/command/ServerCommandManager.html"
sourceType: javadoc
---

# ServerCommandManager

**Inheritance:** java.lang.Object → net.minecraft.command.CommandHandler → net.minecraft.command.ServerCommandManager

## Class signature

```java
public class ServerCommandManager extends CommandHandler implements ICommandListener
```

## Constructors

- `ServerCommandManager(MinecraftServer serverIn)`

## Methods

- `protected MinecraftServer getServer()`
- `void notifyListener(ICommandSender sender, ICommand command, int flags, java.lang.String translationKey, java.lang.Object... translationArgs)`
