---
title: "ServerCommandManager"
description: "public class ServerCommandManager extends CommandHandler implements ICommandListener"
package: "net/minecraft/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/ServerCommandManager.html"
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
