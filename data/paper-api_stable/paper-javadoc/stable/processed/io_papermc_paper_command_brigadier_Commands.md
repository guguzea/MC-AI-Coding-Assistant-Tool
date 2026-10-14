---
title: "io.papermc.paper.command.brigadier.Commands"
package: "io.papermc.paper.command.brigadier"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/Commands.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Commands**
`@NonExtendable public interface Commands extends Registrar`
- `static com.mojang.brigadier.builder.LiteralArgumentBuilder<CommandSourceStack> literal(String literal)`
- `static <T> com.mojang.brigadier.builder.RequiredArgumentBuilder<CommandSourceStack, T> argument(String name, com.mojang.brigadier.arguments.ArgumentType<T> argumentType)`
- `static Predicate<CommandSourceStack> restricted(Predicate<CommandSourceStack> predicate)`
- `static Predicate<CommandSourceStack> unrestricted(Predicate<CommandSourceStack> predicate)`
- `com.mojang.brigadier.CommandDispatcher<CommandSourceStack> getDispatcher()`
- `default @Unmodifiable Set<String> register(com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node)`
- `default @Unmodifiable Set<String> register(com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node, @Nullable String description)`
- `default @Unmodifiable Set<String> register(com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node, Collection<String> aliases)`
- `@Unmodifiable Set<String> register(com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node, @Nullable String description, Collection<String> aliases)`
- `@Unmodifiable Set<String> register(PluginMeta pluginMeta, com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node, @Nullable String description, Collection<String> aliases)`
- `@Internal @Unmodifiable Set<String> registerWithFlags(PluginMeta pluginMeta, com.mojang.brigadier.tree.LiteralCommandNode<CommandSourceStack> node, @Nullable String description, Collection<String> aliases, Set<CommandRegistrationFlag> flags)`
- `default @Unmodifiable Set<String> register(String label, BasicCommand basicCommand)`
- `default @Unmodifiable Set<String> register(String label, @Nullable String description, BasicCommand basicCommand)`
- `default @Unmodifiable Set<String> register(String label, Collection<String> aliases, BasicCommand basicCommand)`
- `@Unmodifiable Set<String> register(String label, @Nullable String description, Collection<String> aliases, BasicCommand basicCommand)`
- `@Unmodifiable Set<String> register(PluginMeta pluginMeta, String label, @Nullable String description, Collection<String> aliases, BasicCommand basicCommand)`
