---
title: "GameRuleChangeEvent"
description: "Fired when a game rule is changed, via CommandGameRule.notifyGameRuleChange(GameRules, String, MinecraftServer) . This allows updating clients with the effects of server rule changes."
package: "net/minecraftforge/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/GameRuleChangeEvent.html"
sourceType: javadoc
---

# GameRuleChangeEvent

## Class signature

```java
public class GameRuleChangeEvent extends Event
```

## Constructors

- `public GameRuleChangeEvent( GameRules rules, java.lang.String ruleName, MinecraftServer server)`

## Methods

- `public GameRules getRules()`
- `public java.lang.String getRuleName()`
- `public MinecraftServer getServer()`

## Description

Fired when a game rule is changed, via CommandGameRule.notifyGameRuleChange(GameRules, String, MinecraftServer) . This allows updating clients with the effects of server rule changes.
