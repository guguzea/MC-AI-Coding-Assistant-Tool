# CommandBase

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `CommandBase()`

## Methods

- `java.util.List<java.lang.String> addTabCompletionOptions(ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `static java.lang.String buildString(java.lang.String[] args, int startPos)` — Builds a string starting at startPos
- `boolean canCommandSenderUseCommand(ICommandSender sender)` — Returns true if the given command sender is allowed to use this command.
- `int compareTo(ICommand p_compareTo_1_)`
- `static boolean doesStringStartWith(java.lang.String original, java.lang.String region)` — Returns true if the given substring is exactly equal to the start of the given string (case insensitive).
- `static java.util.List<Entity> func_175763_c(ICommandSender p_175763_0_, java.lang.String p_175763_1_)`
- `static Entity func_175768_b(ICommandSender p_175768_0_, java.lang.String p_175768_1_)`
- `static java.util.List<java.lang.String> func_175771_a(java.lang.String[] p_175771_0_, int p_175771_1_, BlockPos p_175771_2_)`
- `static java.util.List<java.lang.String> func_181043_b(java.lang.String[] p_181043_0_, int p_181043_1_, BlockPos p_181043_2_)`
- `static Block getBlockByText(ICommandSender sender, java.lang.String id)` — Gets the Block specified by the given text string.
- `static IChatComponent getChatComponentFromNthArg(ICommandSender sender, java.lang.String[] args, int p_147178_2_)`
- `static IChatComponent getChatComponentFromNthArg(ICommandSender sender, java.lang.String[] args, int index, boolean p_147176_3_)`
- `java.util.List<java.lang.String> getCommandAliases()`
- `static EntityPlayerMP getCommandSenderAsPlayer(ICommandSender sender)` — Returns the given ICommandSender as a EntityPlayer or throw an exception.
- `static<T extends Entity> T getEntity(ICommandSender commandSender, java.lang.String p_175759_1_, java.lang.Class<? extends T> p_175759_2_)`
- `static java.lang.String getEntityName(ICommandSender p_175758_0_, java.lang.String p_175758_1_)` — Attempts to retrieve an entity's name, first assuming that the entity is a player, and then exhausting all other possibilities.
- `static Item getItemByText(ICommandSender sender, java.lang.String id)` — Gets the Item specified by the given text string.
- `static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] p_175762_0_, java.util.Collection<?> p_175762_1_)`
- `static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] args, java.lang.String... possibilities)`
- `static EntityPlayerMP getPlayer(ICommandSender sender, java.lang.String username)`
- `static java.lang.String getPlayerName(ICommandSender sender, java.lang.String query)`
- `int getRequiredPermissionLevel()` — Return the required permission level for this command.
- `boolean isUsernameIndex(java.lang.String[] args, int index)` — Return whether the specified command parameter index is a username parameter.
- `static IChatComponent join(java.util.List<IChatComponent> components)`
- `static java.lang.String joinNiceString(java.lang.Object[] elements)` — Creates a linguistic series joining the input objects together.
- `static java.lang.String joinNiceStringFromCollection(java.util.Collection<java.lang.String> strings)` — Creates a linguistic series joining together the elements of the given collection.
- `static void notifyOperators(ICommandSender sender, ICommand command, int p_152374_2_, java.lang.String msgFormat, java.lang.Object... msgParams)`
- `static void notifyOperators(ICommandSender sender, ICommand command, java.lang.String msgFormat, java.lang.Object... msgParams)`
- `static BlockPos parseBlockPos(ICommandSender sender, java.lang.String[] args, int startIndex, boolean centerBlock)`
- `static boolean parseBoolean(java.lang.String input)`
- `static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String p_175770_2_, boolean centerBlock)`
- `static CommandBase.CoordinateArg parseCoordinate(double p_175767_0_, java.lang.String p_175767_2_, int min, int max, boolean centerBlock)`
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
- `static void setAdminCommander(IAdminCommand command)` — Sets the static IAdminCommander.