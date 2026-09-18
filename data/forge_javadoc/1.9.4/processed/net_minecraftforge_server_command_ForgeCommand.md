# ForgeCommand

## Class signature

```java
public class ForgeCommand extends CommandBase
```

## Constructors

- `public ForgeCommand()`

## Methods

- `public java.lang.String getCommandName()`
- `public java.lang.String getCommandUsage( ICommandSender icommandsender)`
- `public int getRequiredPermissionLevel()`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public java.util.List<java.lang.String> getTabCompletionOptions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`