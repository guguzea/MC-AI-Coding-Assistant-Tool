---
title: "ScorePlayerTeam"
description: "public class ScorePlayerTeam extends Team"
package: "net/minecraft/scoreboard"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/scoreboard/ScorePlayerTeam.html"
sourceType: javadoc
---

# ScorePlayerTeam

**Inheritance:** java.lang.Object → net.minecraft.scoreboard.Team → net.minecraft.scoreboard.ScorePlayerTeam

## Class signature

```java
public class ScorePlayerTeam extends Team
```

## Constructors

- `ScorePlayerTeam(Scoreboard theScoreboardIn, java.lang.String name)`

## Methods

- `static java.lang.String formatPlayerName(Team teamIn, java.lang.String string)`
- `java.lang.String formatString(java.lang.String input)`
- `boolean getAllowFriendlyFire()`
- `TextFormatting getChatFormat()`
- `Team.CollisionRule getCollisionRule()`
- `java.lang.String getColorPrefix()`
- `java.lang.String getColorSuffix()`
- `Team.EnumVisible getDeathMessageVisibility()`
- `int getFriendlyFlags()`
- `java.util.Collection<java.lang.String> getMembershipCollection()`
- `Team.EnumVisible getNameTagVisibility()`
- `java.lang.String getRegisteredName()`
- `boolean getSeeFriendlyInvisiblesEnabled()`
- `java.lang.String getTeamName()`
- `void setAllowFriendlyFire(boolean friendlyFire)`
- `void setChatFormat(TextFormatting format)`
- `void setCollisionRule(Team.CollisionRule rule)`
- `void setDeathMessageVisibility(Team.EnumVisible visibility)`
- `void setFriendlyFlags(int flags)`
- `void setNamePrefix(java.lang.String prefix)`
- `void setNameSuffix(java.lang.String suffix)`
- `void setNameTagVisibility(Team.EnumVisible visibility)`
- `void setSeeFriendlyInvisiblesEnabled(boolean friendlyInvisibles)`
- `void setTeamName(java.lang.String name)`
