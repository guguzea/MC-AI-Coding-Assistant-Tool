# CommandEvent

## Class signature

```java
public class CommandEvent extends Event
```

## Constructors

- `public CommandEvent( ICommand command, ICommandSender sender, java.lang.String[] parameters)`

## Methods

- `public ICommand getCommand()`
- `public ICommandSender getSender()`
- `public java.lang.String[] getParameters()`
- `public void setParameters(java.lang.String[] parameters)`
- `public java.lang.Throwable getException()`
- `public void setException(java.lang.Throwable exception)`

## Description

CommandEvent is fired whenever a command is scheduled to be executed. This event is fired during the invocation of CommandHandler#executeCommand(ICommandSender, String) and ClientCommandHandler#execut