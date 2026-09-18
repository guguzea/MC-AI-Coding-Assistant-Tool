---
title: "CommandBase"
description: "public abstract class CommandBase extends java.lang.Object implements ICommand"
package: "net/minecraft/command"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/command/CommandBase.html"
sourceType: javadoc
---

# CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `public CommandBase()`

## Methods

- `protected static SyntaxErrorException toSyntaxException(com.google.gson.JsonParseException e)`
- `protected static NBTTagCompound entityToNBT( Entity theEntity)`
- `public int getRequiredPermissionLevel()`
- `public java.util.List<java.lang.String> getCommandAliases()`
- `public boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, @Nullable BlockPos pos)`
- `public static int parseInt(java.lang.String input) throws NumberInvalidException`
- `public static int parseInt(java.lang.String input, int min) throws NumberInvalidException`
- `public static int parseInt(java.lang.String input, int min, int max) throws NumberInvalidException`
- `public static long parseLong(java.lang.String input) throws NumberInvalidException`
- `public static long parseLong(java.lang.String input, long min, long max) throws NumberInvalidException`
- `public static BlockPos parseBlockPos( ICommandSender sender, java.lang.String[] args, int startIndex, boolean centerBlock) throws NumberInvalidException`
- `public static double parseDouble(java.lang.String input) throws NumberInvalidException`
- `public static double parseDouble(java.lang.String input, double min) throws NumberInvalidException`
- `public static double parseDouble(java.lang.String input, double min, double max) throws NumberInvalidException`
- `public static boolean parseBoolean(java.lang.String input) throws CommandException`
- `public static EntityPlayerMP getCommandSenderAsPlayer( ICommandSender sender) throws PlayerNotFoundException`
- `public static EntityPlayerMP getPlayer( MinecraftServer server, ICommandSender sender, java.lang.String target) throws PlayerNotFoundException`
- `public static Entity getEntity( MinecraftServer server, ICommandSender sender, java.lang.String target) throws EntityNotFoundException`
- `public static <T extends Entity > T getEntity( MinecraftServer server, ICommandSender sender, java.lang.String target, java.lang.Class<? extends T> targetClass) throws EntityNotFoundException`
- `public static java.util.List< Entity > getEntityList( MinecraftServer server, ICommandSender sender, java.lang.String target) throws EntityNotFoundException`
- `public static java.lang.String getPlayerName( MinecraftServer server, ICommandSender sender, java.lang.String target) throws PlayerNotFoundException`
- `public static java.lang.String getEntityName( MinecraftServer server, ICommandSender sender, java.lang.String target) throws EntityNotFoundException`
- `public static ITextComponent getChatComponentFromNthArg( ICommandSender sender, java.lang.String[] args, int index) throws CommandException , PlayerNotFoundException`
- `public static ITextComponent getChatComponentFromNthArg( ICommandSender sender, java.lang.String[] args, int index, boolean p_147176_3_) throws PlayerNotFoundException`
- `public static java.lang.String buildString(java.lang.String[] args, int startPos)`
- `public static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String selectorArg, boolean centerBlock) throws NumberInvalidException`
- `public static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String selectorArg, int min, int max, boolean centerBlock) throws NumberInvalidException`
- `public static double parseDouble(double base, java.lang.String input, boolean centerBlock) throws NumberInvalidException`
- `public static double parseDouble(double base, java.lang.String input, int min, int max, boolean centerBlock) throws NumberInvalidException`
- `public static Item getItemByText( ICommandSender sender, java.lang.String id) throws NumberInvalidException`
- `public static Block getBlockByText( ICommandSender sender, java.lang.String id) throws NumberInvalidException`
- `public static java.lang.String joinNiceString(java.lang.Object[] elements)`
- `public static ITextComponent join(java.util.List< ITextComponent > components)`
- `public static java.lang.String joinNiceStringFromCollection(java.util.Collection<java.lang.String> strings)`
- `public static java.util.List<java.lang.String> getTabCompletionCoordinate(java.lang.String[] inputArgs, int index, @Nullable BlockPos pos)`
- `@Nullable public static java.util.List<java.lang.String> getTabCompletionCoordinateXZ(java.lang.String[] inputArgs, int index, @Nullable BlockPos lookedPos)`
- `public static boolean doesStringStartWith(java.lang.String original, java.lang.String region)`
- `public static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] args, java.lang.String... possibilities)`
- `public static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] inputArgs, java.util.Collection<?> possibleCompletions)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public static void notifyCommandListener( ICommandSender sender, ICommand command, java.lang.String translationKey, java.lang.Object... translationArgs)`
- `public static void notifyCommandListener( ICommandSender sender, ICommand command, int flags, java.lang.String translationKey, java.lang.Object... translationArgs)`
- `public static void setCommandListener( ICommandListener listener)`
- `public int compareTo( ICommand p_compareTo_1_)`
