# EntitySelector

**Inheritance:** java.lang.Object → net.minecraft.command.EntitySelector

## Class signature

```java
public class EntitySelector extends java.lang.Object
```

## Constructors

- `EntitySelector()`

## Methods

- `static java.util.Map<java.lang.String, java.lang.Integer> getScoreMap(java.util.Map<java.lang.String, java.lang.String> params)`
- `static boolean isSelector(java.lang.String selectorStr)`
- `static<T extends Entity> java.util.List<T> matchEntities(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static ITextComponent matchEntitiesToTextComponent(ICommandSender sender, java.lang.String token)`
- `static boolean matchesMultiplePlayers(java.lang.String selectorStr)`
- `static<T extends Entity> T matchOneEntity(ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass)`
- `static EntityPlayerMP matchOnePlayer(ICommandSender sender, java.lang.String token)`