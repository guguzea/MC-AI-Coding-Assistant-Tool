# CommandEvent

## Class signature

```java
public class CommandEvent extends Event
```

## Constructors

- `public CommandEvent( ICommand command, ICommandSender sender, java.lang.String[] parameters)`

## Description

CommandEvent is fired whenever a command is scheduled to be executed. This event is fired during the invocation of CommandHandler#executeCommand(ICommandSender, String) and ClientCommandHandler#execut