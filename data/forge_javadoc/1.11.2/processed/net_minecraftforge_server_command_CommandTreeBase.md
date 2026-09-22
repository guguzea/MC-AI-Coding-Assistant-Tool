# CommandTreeBase

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase → net.minecraftforge.server.command.CommandTreeBase

## Class signature

```java
public abstract class CommandTreeBase extends CommandBase
```

## Constructors

- `CommandTreeBase()`

## Methods

- `void addSubcommand(ICommand c)`
- `void execute(MinecraftServer server, ICommandSender sender, java.lang.String[] args)`
- `java.util.Map<java.lang.String, ICommand> getCommandMap()`
- `java.util.List<ICommand> getSortedCommandList()`
- `java.util.Collection<ICommand> getSubCommands()`
- `java.util.List<java.lang.String> getTabCompletions(MinecraftServer server, ICommandSender sender, java.lang.String[] args, BlockPos pos)`
- `boolean isUsernameIndex(java.lang.String[] args, int index)`