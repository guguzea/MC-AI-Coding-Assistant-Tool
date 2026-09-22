# ScorePlayerTeam

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Team → net.minecraft.scoreboard.ScorePlayerTeam

## Class signature

```java
public class ScorePlayerTeam extends Team
```

## Constructors

- `ScorePlayerTeam(Scoreboard scoreboardIn, java.lang.String name)`

## Methods

- `static java.lang.String formatPlayerName(Team teamIn, java.lang.String string)`
- `java.lang.String formatString(java.lang.String input)`
- `boolean getAllowFriendlyFire()`
- `Team.CollisionRule getCollisionRule()`
- `TextFormatting getColor()`
- `Team.EnumVisible getDeathMessageVisibility()`
- `java.lang.String getDisplayName()`
- `int getFriendlyFlags()`
- `java.util.Collection<java.lang.String> getMembershipCollection()`
- `java.lang.String getName()`
- `Team.EnumVisible getNameTagVisibility()`
- `java.lang.String getPrefix()`
- `boolean getSeeFriendlyInvisiblesEnabled()`
- `java.lang.String getSuffix()`
- `void setAllowFriendlyFire(boolean friendlyFire)`
- `void setCollisionRule(Team.CollisionRule rule)`
- `void setColor(TextFormatting color)`
- `void setDeathMessageVisibility(Team.EnumVisible visibility)`
- `void setDisplayName(java.lang.String name)`
- `void setFriendlyFlags(int flags)`
- `void setNameTagVisibility(Team.EnumVisible visibility)`
- `void setPrefix(java.lang.String prefix)`
- `void setSeeFriendlyInvisiblesEnabled(boolean friendlyInvisibles)`
- `void setSuffix(java.lang.String suffix)`