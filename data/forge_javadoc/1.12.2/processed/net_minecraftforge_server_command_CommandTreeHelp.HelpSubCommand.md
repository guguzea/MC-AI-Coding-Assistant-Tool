# CommandTreeHelp.HelpSubCommand

## Constructors

- `public HelpSubCommand( CommandTreeHelp parent, ICommand command)`

## Methods

- `public int getRequiredPermissionLevel()`
- `public java.lang.String getName()`
- `public java.lang.String getUsage( ICommandSender sender)`
- `public boolean checkPermission( MinecraftServer server, ICommandSender sender)`
- `public void execute( MinecraftServer server, ICommandSender sender, java.lang.String[] args) throws CommandException`