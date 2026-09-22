---
title: "CommandBase"
description: "public abstract class CommandBase extends java.lang.Object implements ICommand"
package: "net/minecraft/command"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/CommandBase.html"
sourceType: javadoc
---

# CommandBase

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `CommandBase()`

## Methods

- `static java.lang.String buildString(java.lang.String[] args, int startPos)`
- `boolean checkPermission(MinecraftServer server, ICommandSender sender)`
- `int compareTo(ICommand p_compareTo_1_)`
- `static boolean doesStringStartWith(java.lang.String original, java.lang.String region)`
- `protected static NBTTagCompound entityToNBT(Entity theEntity)`
- `static Block getBlockByText(ICommandSender sender, java.lang.String id)`
- `static ITextComponent getChatComponentFromNthArg(ICommandSender sender, java.lang.String[] args, int index)`
- `static ITextComponent getChatComponentFromNthArg(ICommandSender sender, java.lang.String[] args, int index, boolean p_147176_3_)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `static EntityPlayerMP getCommandSenderAsPlayer(ICommandSender sender)`
- `static Entity getEntity(MinecraftServer server, ICommandSender sender, java.lang.String target)`
- `static<T extends Entity> T getEntity(MinecraftServer server, ICommandSender sender, java.lang.String target, java.lang.Class<? extends T> targetClass)`
- `static java.util.List<Entity> getEntityList(MinecraftServer server, ICommandSender sender, java.lang.String target)`
- `static java.lang.String getEntityName(MinecraftServer server, ICommandSender sender, java.lang.String target)`
- `static Item getItemByText(ICommandSender sender, java.lang.String id)`
- `static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] inputArgs, java.util.Collection<?> possibleCompletions)`
- `static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] args, java.lang.String... possibilities)`
- `static EntityPlayerMP getPlayer(MinecraftServer server, ICommandSender sender, java.lang.String target)`
- `static java.lang.String getPlayerName(MinecraftServer server, ICommandSender sender, java.lang.String target)`
- `int getRequiredPermissionLevel()`
- `static java.util.List<java.lang.String> getTabCompletionCoordinate(java.lang.String[] inputArgs, int index, BlockPos pos)`
- `static java.util.List<java.lang.String> getTabCompletionCoordinateXZ(java.lang.String[] inputArgs, int index, BlockPos lookedPos)`
- `java.util.List<java.lang.String> getTabCompletionOptions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`
- `static ITextComponent join(java.util.List<ITextComponent> components)`
- `static java.lang.String joinNiceString(java.lang.Object[] elements)`
- `static java.lang.String joinNiceStringFromCollection(java.util.Collection<java.lang.String> strings)`
- `static void notifyCommandListener(ICommandSender sender, ICommand command, int flags, java.lang.String translationKey, java.lang.Object... translationArgs)`
- `static void notifyCommandListener(ICommandSender sender, ICommand command, java.lang.String translationKey, java.lang.Object... translationArgs)`
- `static BlockPos parseBlockPos(ICommandSender sender, java.lang.String[] args, int startIndex, boolean centerBlock)`
- `static boolean parseBoolean(java.lang.String input)`
- `static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String selectorArg, boolean centerBlock)`
- `static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String selectorArg, int min, int max, boolean centerBlock)`
- `static double parseDouble(double base, java.lang.String input, boolean centerBlock)`
- `static double parseDouble(double base, java.lang.String input, int min, int max, boolean centerBlock)`
- `static double parseDouble(java.lang.String input)`
- `static double parseDouble(java.lang.String input, double min)`
- `static double parseDouble(java.lang.String input, double min, double max)`
- `static int parseInt(java.lang.String input)`
- `static int parseInt(java.lang.String input, int min)`
- `static int parseInt(java.lang.String input, int min, int max)`
- `static long parseLong(java.lang.String input)`
- `static long parseLong(java.lang.String input, long min, long max)`
- `static void setCommandListener(ICommandListener listener)`
- `protected static SyntaxErrorException toSyntaxException(com.google.gson.JsonParseException e)`
