---
title: "io.papermc.paper.command.brigadier.argument.CustomArgumentType"
package: "io.papermc.paper.command.brigadier.argument"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/argument/CustomArgumentType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CustomArgumentType<T,N>**
`public interface CustomArgumentType<T,N> extends com.mojang.brigadier.arguments.ArgumentType<T>`
- `T parse(com.mojang.brigadier.StringReader reader) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `default <S> T parse(com.mojang.brigadier.StringReader reader, S source) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `com.mojang.brigadier.arguments.ArgumentType<N> getNativeType()`
- `@NonExtendable default Collection<String> getExamples()`
- `default <S> CompletableFuture<com.mojang.brigadier.suggestion.Suggestions> listSuggestions(com.mojang.brigadier.context.CommandContext<S> context, com.mojang.brigadier.suggestion.SuggestionsBuilder builder)`
