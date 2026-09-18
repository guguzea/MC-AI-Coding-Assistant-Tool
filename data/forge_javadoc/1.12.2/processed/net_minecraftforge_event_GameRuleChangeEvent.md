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