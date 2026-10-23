---
title: "io.papermc.paper.command.brigadier.argument.CustomArgumentType"
package: "io.papermc.paper.command.brigadier.argument"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/command/brigadier/argument/CustomArgumentType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `T parse(com.mojang.brigadier.StringReader reader) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `default <S> T parse(com.mojang.brigadier.StringReader reader, S source) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `com.mojang.brigadier.arguments.ArgumentType<N> getNativeType()`
- `@NonExtendable default Collection<String> getExamples()`
- `default <S> CompletableFuture<com.mojang.brigadier.suggestion.Suggestions> listSuggestions(com.mojang.brigadier.context.CommandContext<S> context, com.mojang.brigadier.suggestion.SuggestionsBuilder builder)`
