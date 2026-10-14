---
title: "com.destroystokyo.paper.exception.ServerCommandException"
package: "com.destroystokyo.paper.exception"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/exception/ServerCommandException.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ServerCommandException**
`public class ServerCommandException extends ServerException`
- `public ServerCommandException(String message, Throwable cause, Command command, CommandSender commandSender, String[] arguments)`
- `public ServerCommandException(Throwable cause, Command command, CommandSender commandSender, String[] arguments)`
- `protected ServerCommandException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Command command, CommandSender commandSender, String[] arguments)`
- `public Command getCommand()`
- `public CommandSender getCommandSender()`
- `public String[] getArguments()`
