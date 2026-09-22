---
title: "CommandGameRule"
description: "public class CommandGameRule extends CommandBase"
package: "net/minecraft/command"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/CommandGameRule.html"
sourceType: javadoc
---

# CommandGameRule

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraft.command.CommandGameRule

## Class signature

```java
public class CommandGameRule extends CommandBase
```

## Constructors

- `CommandGameRule()`

## Methods

- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.lang.String getCommandName()`
- `java.lang.String getCommandUsage(ICommandSender sender)`
- `int getRequiredPermissionLevel()`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `static void notifyGameRuleChange(GameRules rules, java.lang.String p_184898_1_, MinecraftServer server)`
