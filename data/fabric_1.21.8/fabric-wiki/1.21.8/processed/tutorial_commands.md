> 来源：https://fabricmc.net/wiki/doku.php?id=tutorial:commands
> 版本：1.21.8
> 页面 ID：tutorial:commands
> 优先级：🟡
> 抓取源：wiki_raw
> 警告：现行 Wiki，不是该 Minecraft 版本的历史快照。禁止把 wiki 正文里的 Registries / BuiltInRegistries 当成 1.16.5 等旧档 API。

Licensing: The code in this article is licensed under the "Creative Commons Zero v1.0 Universal" license. The license grants you the rights to use the code examples shown in this article in your own mods.

# Creating Commands
Creating commands can allow a mod developer to add functionality that can be used through a command. This tutorial will teach you how to register commands, and the general command structure of Brigadier.

## What is Brigadier?
Brigadier is a command parser & dispatcher written by Mojang for use in Minecraft. Brigadier is a tree based command library where you build a tree of arguments and commands.

The source code for brigadier can be found here: https://github.com/Mojang/brigadier

## The Command interface
In Minecraft, com.mojang.brigadier.Command is a functional interface, which runs some specific things, and throw a CommandSyntaxException in some cases. It has a generic type S, which defines the type of the //command source//. The command source provides some context in which a command was ran. In Minecraft, the command source is typically a `class_2168` which can represent a server, a command block, rcon connection, a player or an entity. In some cases, it can also be a `class_637`.

The single method in Command, run(CommandContext<S>) takes a CommandContext<S> as the sole parameter and returns an integer. The command context holds your command source of S and allows you to obtain arguments, look at the parsed command nodes and see the input used in this command.

Like other functional interfaces, it is usually used as a lambda or a method reference:

```java

Command<ServerCommandSource> command = context -> {
    return 0;
};

```


<!-- key:🟠 role:常见错误 -->

The integer can be considered the result of the command. Typically negative values mean a command has failed and will do nothing. A result of 0 means the command has passed. Positive values mean the command was successful and did something.

### What can the ServerCommandSource do?
A ServerCommandSource provides some additional implementation specific context when a command is run. This includes the ability to get the entity that executed the command, the world the command was ran in or the server the command was run on.

```java

// Get the source. This will always work.
final ServerCommandSource source = ctx.getSource(); 

// Unchecked, may be null if the sender was the console or the command block.
final @Nullable Entity sender = source.getEntity(); 

// Will throw an exception if the executor of the command was not an Entity. 
// The result of this could contain a player. Also will send feedback telling the sender of the command that they must be an entity. 
// This method will require your methods to throw a CommandSyntaxException. 
// The entity options in ServerCommandSource could return a CommandBlock entity, any living entity or a player.
final @NotNull Entity sender2 = source.getEntityOrThrow(); 

// null if the executor of the command is not a player.
final @Nullable ServerPlayerEntity player = source.getPlayer():

// Will throw an exception if the executor of the command was not explicitly a Player.
// Also will send feedback telling the sender of the command that they must be a player.
// This method will require your methods to throw a CommandSyntaxException.
final @NotNull ServerPlayerEntity player = source.getPlayerOrThrow(); 

// Gets the sender's position as a Vec3d when the command was sent.
// This could be the location of the entity/command block or in the case of the console, the world's spawn point.
final Vec3d position = source.getPosition(); 

// Gets the world the sender is within. The console's world is the same as the default spawn world.
final ServerWorld world = source.getWorld(); 

// Gets the sender's rotation as a Vec2f.
final Vec2f rotation = source.getRotation(); 

// Access to the instance of the MinecraftServer this command was ran on.
final MinecraftServer server = source.getServer(); 

// The name of the command source. This could be the name of the entity, player,
// the name of a CommandBlock that has been renamed before being placed down, or in the case of the Console, "Console".
final String name = source.getName(); 

// Returns true if the source of the command has a certain permission level.
// This is based on the operator status of the sender.
// (On an integrated server, the player must have cheats enabled to execute these commands.)
final boolean b = source.hasPermissionLevel(int level); 

```

## Register a basic command
Commands are registered by registering in CommandRegistrationCallback in the Fabric API. For information on registering callbacks, please see the [callbacks](callbacks).

The event should be registered in your mod's initializer. The callback has three parameters. The CommmandDispatcher<S> is used to register, parse and execute commands. S is the type of command source the command dispatcher supports, which is usually ServerCommandSource. The second parameter provides an abstraction to registries which may be passed to certain command argument methods. The third parameter is a RegistrationEnvironment which identifies the type of server the commands are being registered on.

To simplify the code, it is highly recommended to static import the methods in CommandManager (see [#Static Imports](#Static Imports)):
```java

import static net.minecraft.server.command.CommandManager.*;

```

In the mod initializer, we just register the simplest command:

```java

public class ExampleMod implements ModInitializer {
  @Override
  public void onInitialize() {
    CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> dispatcher.register(literal("foo")
        .executes(context -> {
      // For versions below 1.19, replace "Text.literal" with "new LiteralText".
      // For versions below 1.20, remode "() ->" directly.
      context.getSource().sendFeedback(() -> Text.literal("Called /foo with no arguments"), false);

      return 1;
    })));
  }
}

```

**Please ensure you import the correct static method.** The method literal is CommandManager.literal. You can also alternatively explicitly write CommandManager.literal instead of using static imports. `CommandManager.literal("foo")` tells brigadier this command has one node, a **literal** called foo.


<!-- key:🟠 role:常见错误 -->

In the sendFeedback method, the first parameter is the text to be sent, which is a Text in versions below 1.20, or a Supplier<Text> in 1.20 and above (this is used to avoid instantiating Text objects when not needed, so please do not use Suppliers.ofInstance or smiliar methods). The second parameter determines whether to broadcast the feedback to other operators. If the command is to //query// something without actually affecting the world, such as query the current time or some player's score, it should be false. If the command actually //does// something, such as changing the time or modifying someone's score, it should be true. If game rule sendCommandFeedback is false, you will not accept any feedback. If the sender is modifed through /execute as ..., the feedback is sent to the original sender.

If the command fails, instead of calling sendFeedback, you may directly throw a CommandSyntaxException or `class_2164`. See [command_exceptions](command_exceptions) for details.

To execute this command, you must type /foo, which is case-sensitive. If /Foo, /FoO, /FOO, /fOO or /fooo is typed instead, the command will not run.

## Registration environment
If desired, you can also make sure a command is only registered under some specific circumstances, for example, only in the dedicated environment:

```java
public class ExampleCommandMod implements ModInitializer {
    @Override
    public void onInitialize() {
        CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> {
            if (environment.field_25423) {
                ...;
            }
        });
    }
}
```

## Static Imports
In the example above, the use of static imports is used for code simplifying. For a literal this would shorten the statement to `literal("foo")`. This also works for getting the value of an argument. This shortens `StringArgumentType.getString(ctx, "string")` to `getString(ctx, "string")`. This also works for Minecraft's own argument types.

Below is an example of some static imports:
```java

// getString(ctx, "string")
import static com.mojang.brigadier.arguments.StringArgumentType.getString;
// word()
import static com.mojang.brigadier.arguments.StringArgumentType.word;
 // literal("foo")
import static net.minecraft.server.command.CommandManager.literal;
 // argument("bar", word())
import static net.minecraft.server.command.CommandManager.argument;
// Import everything in the CommandManager
import static net.minecraft.server.command.CommandManager.*;

```

Note: Please be sure you use the literal and argument from CommandManager instead of other classes, or you may have issues with generics when trying to compile, because the type parameter S should be ServerCommandSource. (For client-side commands, use ClientCommandManager instead.)

Brigadier's default arguments are at com.mojang.brigadier.arguments

Minecraft's arguments are in net.minecraft.command.arguments. CommandManager is in the package net.minecraft.server.command.

## Add Requirements
Let's say you have a command that you only want operators to be able to execute. This is where the requires method comes into play. The requires method has one argument of a Predicate<ServerCommandSource> which will supply a ServerCommandSource to test with and determine if the CommandSource can execute the command.

For example this may look like the following:

```java

dispatcher.register(literal("foo")
  .requires(source -> source.hasPermissionLevel(2))
  .executes(ctx -> {
    ctx.getSource().sendFeedback(() -> Text.literal("You are an operator"), false);
    return 1;
  });

```

This command will only execute if the source of the command is a level 2 operator at minimum, //including// command blocks. Otherwise, the command is not registered. Also this has the side effect of not showing this command in tab completion to anyone who is not a level 2 operator. This is also why you cannot tab-complete most commands when you did not enable cheating.

To create commands that only level 4 operators (//not including// command blocks) can execute, use source.hasPermissionLevel(4).

## Arguments

<!-- key:🟠 role:常见错误 -->

Arguments are used in most of commands. Sometimes they can be optional, which means if you do not provide that argument, the command will also run. One node may have multiple argument types, but be aware that there is possibility of ambiguity, which should be avoided.

In this case, we add one integer argument, and calculate the square of the integer.

```java

    dispatcher.register(literal("mul")
        .then(argument("value", IntegerArgumentType.integer())
            .executes(context -> {
              final int value = IntegerArgumentType.getInteger(context, "value");
              final int result = value * value;
              context.getSource().sendFeedback(() -> Text.literal("%s × %s = %s".formatted(value, value, result)), false);
              return result;
            })));

```

In this case, after the word /mul, you should type an integer. For example, if you run /mul 3, you will get the feedback message "3 × 3 = 9". If you type /mul without arguments, the command cannot be correctly parsed.

Note: for simplicity, IntegerArgumentType.integer and IntegerArgumentType.getInteger can be replaced with integer and getInteger with static import. This example does not use static imports, in order to be more explicit.

Then we add an optional second argument:
```java

    dispatcher.register(literal("mul")
        .then(argument("value", IntegerArgumentType.integer())
            .executes(context -> {
              final int value = IntegerArgumentType.getInteger(context, "value");
              final int result = value * value;
              context.getSource().sendFeedback(() -> Text.literal("%s × %s = %s".formatted(value, value, result)), false);
              return result;
            })
            .then(argument("value2", IntegerArgumentType.integer())
                .executes(context -> {
                  final int value = IntegerArgumentType.getInteger(context, "value");
                  final int value2 = IntegerArgumentType.getInteger(context, "value2");
                  final int result = value * value2;
                  context.getSource().sendFeedback(() -> Text.literal("%s × %s = %s".formatted(value, value2, result)), false);
                  return result;
                }))));

```

Now you can type one or two integers. If you give one integer, that square of integer will be calculated. If you provide two integers, their product will be calculated. You may find it unnecessary to specify similar executions twice. Therefore, we can create a method that will be used in both executions.

```java

public class ExampleMod implements ModInitializer {
  @Override
  public void onInitialize() {
    CommandRegistrationCallback.EVENT.register((dispatcher, registryAccess, environment) -> dispatcher.register(literal("mul")
        .then(argument("value", IntegerArgumentType.integer())
            .executes(context -> executeMultiply(IntegerArgumentType.getInteger(context, "value"), IntegerArgumentType.getInteger(context, "value"), context))
            .then(argument("value2", IntegerArgumentType.integer())
                .executes(context -> executeMultiply(IntegerArgumentType.getInteger(context, "value"), IntegerArgumentType.getInteger(context, "value2"), context))))));
  }

  private static int executeMultiply(int value, int value2, CommandContext<ServerCommandSource> context) {
    final int result = value * value2;
    context.getSource().sendFeedback(() -> Text.literal("%s × %s = %s".formatted(value, value2, result)), false);
    return result;
  }
}

```
## A sub command
To add a sub command, you register the first literal node of the command normally.

```

dispatcher.register(literal("foo"))

```

In order to have a sub command, one needs to append the next node to the existing node. 

This creates the command foo <bar> as shown below.

```java

dispatcher.register(literal("foo")
    .then(literal("bar")
        .executes(context -> {
            // For versions below 1.19, use new LiteralText.
            // For versions below 1.20, use directly the Text object instead of supplier.
            context.getSource().sendFeedback(() -> Text.literal("Called foo with bar"), false);

            return 1;
        })
    )
);

```

Similar to arguments, sub command nodes can also be set optional. In the following case, both /foo and /foo bar will be valid.
```java

dispatcher.register(literal("foo")
    .executes(context -> {
        context.getSource().sendFeedback(() -> Text.literal("Called foo without bar"), false);
        return 1;
    })
    .then(literal("bar")
        .executes(context -> {
            context.getSource().sendFeedback(() -> Text.literal("Called foo with bar"), false);
            return 1;
        })
    )
);

```
# Advanced concepts
Below are links to the articles about more complex concepts used in brigadier.

^ Page                                                           ^ Description                                                                     ^
| [Exceptions](command_exceptions  ) | Fail execution of a command with a descriptive message and in certain contexts. |
| --- | --- |
| [Suggestions](command_suggestions) | Suggesting command input for the client. |
| [Redirects](command_redirects) | Allow use of aliases or repeating elements to execute commands. |
| [Custom Argument Types](command_argument_types) | Parse your own arguments into your own objects. |
| [Examples](command_examples) | Some example commands |

# FAQ
## Why does my code not compile
There are several immediate possibilities for why this could occur.

  * **Catch or throw a CommandSyntaxException:** CommandSyntaxException is not a RuntimeException. If you throw it, where it is throwed should be in methods that throws CommandSyntaxException in method signatures, or be caught. Brigadier will handle the checked exceptions and forward the proper error message in game for you.
  * **Issues with generics:** You may have an issue with generics once in a while. If you are registering server command (which is most of the case), make sure you are using CommandManager.literal(...) or CommandManager.argument(...) instead of LiteralArgumentBuilder.literal or RequiredArgumentBuilder.argument in your static imports.
  * **Check sendFeedback method:** You may have forgotten to provide a boolean as the second argument. Also remember that, since 1.20, the first parameter is Supplier<Text> instead of Text.
  * **Command should return an integer:** When registering commands, the executes method accepts a Command object, which is usually a lambda. The lambda should return an integer, instead of other types.

## Can I register client side commands?
Fabric has a ClientCommandManager that can be used to register client side commands. The code should exist only in client-side codes. Example:

```java

    ClientCommandRegistrationCallback.EVENT.register((dispatcher, registryAccess) -> dispatcher.register(ClientCommandManager.literal("foo_client")
        .executes(context -> {
              context.getSource().sendFeedback(Text.literal("The command is executed in the client!"));
              return 1;
            }
        )));

```

If you need to open a screen in the client command execution, instead of directly calling client.setScreen(...), you should call `client.execute(() -> client.setScreen(...))`. The variable client can be obtained with context.getSource().getClient().

## Can I register commands in runtime?

<!-- key:🟠 role:常见错误 -->

You can do this but it is not recommended. You would get the CommandManager from the server and add anything commands you wish to it's CommandDispatcher.

After that you need to send the command tree to every player again using CommandManager.sendCommandTree(ServerPlayerEntity). This is required because the client locally caches the command tree it receives during login (or when operator packets are sent) for local completions rich error messages.

## Can I unregister commands in runtime?

<!-- key:🟠 role:常见错误 -->

You can also do this, however it is much less stable than registering commands and could cause unwanted side effects. To keep things simple, you need to use reflection on brigadier and remove the nodes. After this, you need to send the command tree to every player again using sendCommandTree(ServerPlayerEntity). If you don't send the updated command tree, the client may think a command still exists, even though the server will fail execution.

## Can I execute command without typing in game?
Yes! You can. Before trying the next code, take note it works on Fabric 0.91.6+1.20.2 and it was not tested in other versions.

Here is the code example

```java

    private void vanillaCommandByPlayer(World world, BlockPos pos, String command) {
        PlayerEntity player = world.getClosestPlayer(pos.getX(), pos.getY(), pos.getZ(), 5, false);
        if (player != null) {
            CommandManager commandManager = Objects.requireNonNull(player.getServer()).getCommandManager();
            ServerCommandSource commandSource = player.getServer().getCommandSource();
            commandManager.executeWithPrefix(commandSource, command);
        }
    }

```

First, you need a CommandManager<ServerCommandSource>.
Second, you need the ServerCommandSource.
Then, u can call some CommandManager public methods like commandeManader.execute. (.execute need ParseResults<ServerCommandSource>)
But commandeManader.executeWithPrefix allow you to use String. You can also put the slash (/).

So... have fun!