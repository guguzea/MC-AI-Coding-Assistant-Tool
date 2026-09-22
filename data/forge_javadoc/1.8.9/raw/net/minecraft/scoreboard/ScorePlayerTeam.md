---
title: "ScorePlayerTeam"
description: "public class ScorePlayerTeam extends Team"
package: "net/minecraft/scoreboard"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/ScorePlayerTeam.html"
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

- `static java.lang.String formatPlayerName(Team p_96667_0_, java.lang.String p_96667_1_)` — Returns the player name including the color prefixes and suffixes
- `java.lang.String formatString(java.lang.String input)`
- `void func_98298_a(int p_98298_1_)`
- `int func_98299_i()`
- `boolean getAllowFriendlyFire()`
- `EnumChatFormatting getChatFormat()`
- `java.lang.String getColorPrefix()` — Returns the color prefix for the player's team name
- `java.lang.String getColorSuffix()` — Returns the color suffix for the player's team name
- `Team.EnumVisible getDeathMessageVisibility()`
- `java.util.Collection<java.lang.String> getMembershipCollection()`
- `Team.EnumVisible getNameTagVisibility()`
- `java.lang.String getRegisteredName()` — Retrieve the name by which this team is registered in the scoreboard
- `boolean getSeeFriendlyInvisiblesEnabled()`
- `java.lang.String getTeamName()`
- `void setAllowFriendlyFire(boolean friendlyFire)`
- `void setChatFormat(EnumChatFormatting p_178774_1_)`
- `void setDeathMessageVisibility(Team.EnumVisible p_178773_1_)`
- `void setNamePrefix(java.lang.String prefix)`
- `void setNameSuffix(java.lang.String suffix)`
- `void setNameTagVisibility(Team.EnumVisible p_178772_1_)`
- `void setSeeFriendlyInvisiblesEnabled(boolean friendlyInvisibles)`
- `void setTeamName(java.lang.String name)`
