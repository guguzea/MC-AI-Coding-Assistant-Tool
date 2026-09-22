> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/execution-privilege?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:49:48.038Z
> 警告：此文档可能滞后于当前正式版

# Scripting Execution Privilege

When Minecraft executes a script, it runs with specific privileges that define what APIs the script has access to. For example, in the following snippet, an error is thrown when attempting to call a function that would modify the world state from a `before` event:

```typescript
world.beforeEvents.playerBreakBlock.subscribe(e => {
 e.player.getGameMode(); // this is fine
 e.player.setGameMode(GameMode.Creative); // this throws an error
});
```

Before events use restricted execution, which prevents modification of world state. However, some APIs, such as `world.sendMessage()`, work from within a `before` event, even though sending a message modifies the world's state slightly. This is because the `sendMessage` function has special privileges that allow it to be called in restricted execution. Bedrock APIs either have no privileges, or one or more privilege that allow them to be used whenever script is being run from those privileges.

## Privilege types

### Restricted execution

In restricted execution, the script can only access APIs with the restricted execution privilege. This is primarily used with `before` events, property getters, and read-only data. Both `before` event and custom command callback closures are run in restricted execution. This helps limit the complexity of changes that scripts can perform while the engine is updating, making execution of the script more stable.

### Early execution

In early execution, the script can only access APIs with the early execution privilege. This is used to restrict access to most APIs when first executing a script during world startup. This allows a script to run before loading most of the pack or world data allowing a script to alter what is loaded. The first time the file is loaded, `system.beforeEvents.startup` event callbacks, and custom component registration all use early execution privileges.

### Default execution

When no special execution modes are used to run a script, the entire API set is available. Coroutines and `after` events are executed this way.

## Old names

In some of our documentation, we used "read only" to mean restricted execution. Our documentation has been updated to say "restricted execution" to help disambiguate between the `readonly` keyword from TypeScript and the general programming concept of non-writable memory.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
