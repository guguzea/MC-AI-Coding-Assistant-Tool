# EntitySelector

## Class signature

```java
public class EntitySelector extends java.lang.Object
```

## Constructors

- `public EntitySelector()`

## Methods

- `public static java.lang.String addArgument(java.lang.String argument)`
- `public static EntityPlayerMP matchOnePlayer( ICommandSender sender, java.lang.String token) throws CommandException`
- `public static java.util.List< EntityPlayerMP > getPlayers( ICommandSender sender, java.lang.String token) throws CommandException`
- `public static <T extends Entity > T matchOneEntity( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `public static ITextComponent matchEntitiesToTextComponent( ICommandSender sender, java.lang.String token) throws CommandException`
- `public static <T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `public static <T extends Entity > java.util.List<T> matchEntitiesDefault( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `public static java.util.Map<java.lang.String,java.lang.Integer> getScoreMap(java.util.Map<java.lang.String,java.lang.String> params)`
- `public static boolean matchesMultiplePlayers(java.lang.String selectorStr) throws CommandException`
- `public static boolean matchesMultiplePlayersDefault(java.lang.String selectorStr) throws CommandException`
- `public static boolean isSelector(java.lang.String selectorStr)`
- `public static boolean isSelectorDefault(java.lang.String selectorStr)`