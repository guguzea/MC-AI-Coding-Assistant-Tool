---
title: "CommandSenderWrapper"
description: "public class CommandSenderWrapper extends java.lang.Object implements ICommandSender"
package: "net/minecraft/command"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/command/CommandSenderWrapper.html"
sourceType: javadoc
---

# CommandSenderWrapper

**Inheritance:** java.lang.Object → net.minecraft.command.CommandSenderWrapper

## Class signature

```java
public class CommandSenderWrapper extends java.lang.Object implements ICommandSender
```

## Constructors

- `CommandSenderWrapper(ICommandSender delegateIn, Vec3d positionVectorIn, BlockPos positionIn, java.lang.Integer permissionLevelIn, Entity entityIn, java.lang.Boolean sendCommandFeedbackIn)`

## Methods

- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `CommandSenderWrapper computePositionVector()`
- `static CommandSenderWrapper create(ICommandSender sender)`
- `Entity getCommandSenderEntity()`
- `ITextComponent getDisplayName()`
- `World getEntityWorld()`
- `java.lang.String getName()`
- `BlockPos getPosition()`
- `Vec3d getPositionVector()`
- `MinecraftServer getServer()`
- `boolean sendCommandFeedback()`
- `void sendMessage(ITextComponent component)`
- `void setCommandStat(CommandResultStats.Type type, int amount)`
- `CommandSenderWrapper withEntity(Entity entityIn, Vec3d p_193997_2_)`
- `CommandSenderWrapper withPermissionLevel(int level)`
- `CommandSenderWrapper withSendCommandFeedback(boolean sendCommandFeedbackIn)`
