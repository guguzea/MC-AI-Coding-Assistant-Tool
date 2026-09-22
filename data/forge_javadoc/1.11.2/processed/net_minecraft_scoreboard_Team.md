# Team

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Team

## Class signature

```java
public abstract class Team extends java.lang.Object
```

## Constructors

- `Team()`

## Methods

- `abstract java.lang.String formatString(java.lang.String input)`
- `abstract boolean getAllowFriendlyFire()`
- `abstract TextFormatting getChatFormat()`
- `abstract Team.CollisionRule getCollisionRule()`
- `abstract Team.EnumVisible getDeathMessageVisibility()`
- `abstract java.util.Collection<java.lang.String> getMembershipCollection()`
- `abstract Team.EnumVisible getNameTagVisibility()`
- `abstract java.lang.String getRegisteredName()`
- `abstract boolean getSeeFriendlyInvisiblesEnabled()`
- `boolean isSameTeam(Team other)`