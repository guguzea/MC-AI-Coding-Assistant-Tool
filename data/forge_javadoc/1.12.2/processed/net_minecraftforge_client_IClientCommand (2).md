# IClientCommand

## Class signature

```java
public interface IClientCommand extends ICommand
```

## Methods

- `boolean allowUsageWithoutPrefix( ICommandSender sender, java.lang.String message)`

## Description

Client-side commands can implement this interface to allow additional control over when the command may be used.