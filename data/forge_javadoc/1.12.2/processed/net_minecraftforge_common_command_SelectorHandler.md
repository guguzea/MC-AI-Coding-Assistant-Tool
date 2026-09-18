# SelectorHandler

## Class signature

```java
public interface SelectorHandler
```

## Methods

- `<T extends Entity > java.util.List<T> matchEntities( ICommandSender sender, java.lang.String token, java.lang.Class<? extends T> targetClass) throws CommandException`
- `boolean matchesMultiplePlayers(java.lang.String selectorStr) throws CommandException`
- `boolean isSelector(java.lang.String selectorStr)`

## Description

Handler for custom types of selectors registered with SelectorHandlerManager