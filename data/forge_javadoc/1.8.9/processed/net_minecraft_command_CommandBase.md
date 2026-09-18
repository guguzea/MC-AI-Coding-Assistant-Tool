# CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `public CommandBase()`

## Methods

- `public int getRequiredPermissionLevel()`
- `public java.util.List<java.lang.String> getCommandAliases()`
- `public boolean canCommandSenderUseCommand( ICommandSender sender)`
- `public java.util.List<java.lang.String> addTabCompletionOptions( ICommandSender sender, java.lang.String[] args, BlockPos pos)`
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
- `public static EntityPlayerMP getPlayer( ICommandSender sender, java.lang.String username) throws PlayerNotFoundException`
- `public static Entity func_175768_b( ICommandSender p_175768_0_, java.lang.String p_175768_1_) throws EntityNotFoundException`
- `public static <T extends Entity > T getEntity( ICommandSender commandSender, java.lang.String p_175759_1_, java.lang.Class<? extends T> p_175759_2_) throws EntityNotFoundException`
- `public static java.util.List< Entity > func_175763_c( ICommandSender p_175763_0_, java.lang.String p_175763_1_) throws EntityNotFoundException`
- `public static java.lang.String getPlayerName( ICommandSender sender, java.lang.String query) throws PlayerNotFoundException`
- `public static java.lang.String getEntityName( ICommandSender p_175758_0_, java.lang.String p_175758_1_) throws EntityNotFoundException`
- `public static IChatComponent getChatComponentFromNthArg( ICommandSender sender, java.lang.String[] args, int p_147178_2_) throws CommandException , PlayerNotFoundException`
- `public static IChatComponent getChatComponentFromNthArg( ICommandSender sender, java.lang.String[] args, int index, boolean p_147176_3_) throws PlayerNotFoundException`
- `public static java.lang.String buildString(java.lang.String[] args, int startPos)`
- `public static CommandBase.CoordinateArg parseCoordinate(double base, java.lang.String p_175770_2_, boolean centerBlock) throws NumberInvalidException`
- `public static CommandBase.CoordinateArg parseCoordinate(double p_175767_0_, java.lang.String p_175767_2_, int min, int max, boolean centerBlock) throws NumberInvalidException`
- `public static double parseDouble(double base, java.lang.String input, boolean centerBlock) throws NumberInvalidException`
- `public static double parseDouble(double base, java.lang.String input, int min, int max, boolean centerBlock) throws NumberInvalidException`
- `public static Item getItemByText( ICommandSender sender, java.lang.String id) throws NumberInvalidException`
- `public static Block getBlockByText( ICommandSender sender, java.lang.String id) throws NumberInvalidException`
- `public static java.lang.String joinNiceString(java.lang.Object[] elements)`
- `public static IChatComponent join(java.util.List< IChatComponent > components)`
- `public static java.lang.String joinNiceStringFromCollection(java.util.Collection<java.lang.String> strings)`
- `public static java.util.List<java.lang.String> func_175771_a(java.lang.String[] p_175771_0_, int p_175771_1_, BlockPos p_175771_2_)`
- `public static java.util.List<java.lang.String> func_181043_b(java.lang.String[] p_181043_0_, int p_181043_1_, BlockPos p_181043_2_)`
- `public static boolean doesStringStartWith(java.lang.String original, java.lang.String region)`
- `public static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] args, java.lang.String... possibilities)`
- `public static java.util.List<java.lang.String> getListOfStringsMatchingLastWord(java.lang.String[] p_175762_0_, java.util.Collection<?> p_175762_1_)`
- `public boolean isUsernameIndex(java.lang.String[] args, int index)`
- `public static void notifyOperators( ICommandSender sender, ICommand command, java.lang.String msgFormat, java.lang.Object... msgParams)`
- `public static void notifyOperators( ICommandSender sender, ICommand command, int p_152374_2_, java.lang.String msgFormat, java.lang.Object... msgParams)`
- `public static void setAdminCommander( IAdminCommand command)`
- `public int compareTo( ICommand p_compareTo_1_)`

## Description

Builds a string starting at startPos