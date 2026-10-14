---
title: "io.papermc.paper.command.brigadier.argument.CustomArgumentType.Converted"
package: "io.papermc.paper.command.brigadier.argument"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/argument/CustomArgumentType.Converted.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CustomArgumentType.Converted<T,N>**
`public static interface CustomArgumentType.Converted<T,N> extends CustomArgumentType<T,N>`
- `@NonExtendable default T parse(com.mojang.brigadier.StringReader reader) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `@NonExtendable default <S> T parse(com.mojang.brigadier.StringReader reader, S source) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `T convert(N nativeType) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `default <S> T convert(N nativeType, S source) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
