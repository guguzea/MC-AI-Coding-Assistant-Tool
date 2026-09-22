# CommandEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.CommandEvent

## Class signature

```java
public class CommandEvent extends Event
```

## Constructors

- `CommandEvent(ICommand command, ICommandSender sender, java.lang.String[] parameters)`

## Methods

- `ICommand getCommand()`
- `java.lang.Throwable getException()`
- `java.lang.String[] getParameters()`
- `ICommandSender getSender()`
- `void setException(java.lang.Throwable exception)`
- `void setParameters(java.lang.String[] parameters)`