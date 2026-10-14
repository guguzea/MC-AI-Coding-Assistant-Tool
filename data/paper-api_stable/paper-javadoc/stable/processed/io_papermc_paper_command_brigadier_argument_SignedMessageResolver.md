---
title: "io.papermc.paper.command.brigadier.argument.SignedMessageResolver"
package: "io.papermc.paper.command.brigadier.argument"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/argument/SignedMessageResolver.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SignedMessageResolver**
`@NonExtendable public interface SignedMessageResolver`
- `String content()`
- `CompletableFuture<SignedMessage> resolveSignedMessage(String argumentName, com.mojang.brigadier.context.CommandContext<CommandSourceStack> context) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
