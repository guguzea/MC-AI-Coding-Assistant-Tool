# CommandGameRule

## Class signature

```java
public class CommandGameRule extends CommandBase
```

## Constructors

- `public CommandGameRule()`

## Methods

- `public java.lang.String getName()`
- `public int getRequiredPermissionLevel()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`
- `public static void notifyGameRuleChange( GameRules rules, java.lang.String p_184898_1_, MinecraftServer server)`
- `public java.util.List<java.lang.String> getTabCompletions( MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos targetPos)`