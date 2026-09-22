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
- `abstract Team.CollisionRule getCollisionRule()`
- `abstract TextFormatting getColor()`
- `abstract Team.EnumVisible getDeathMessageVisibility()`
- `abstract java.util.Collection<java.lang.String> getMembershipCollection()`
- `abstract java.lang.String getName()`
- `abstract Team.EnumVisible getNameTagVisibility()`
- `abstract boolean getSeeFriendlyInvisiblesEnabled()`
- `boolean isSameTeam(Team other)`