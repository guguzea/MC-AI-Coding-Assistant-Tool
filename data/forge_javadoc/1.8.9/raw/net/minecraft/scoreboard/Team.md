---
title: "Team"
description: "public abstract class Team extends java.lang.Object"
package: "net/minecraft/scoreboard"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/scoreboard/Team.html"
sourceType: javadoc
---

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
- `abstract Team.EnumVisible getDeathMessageVisibility()`
- `abstract java.util.Collection<java.lang.String> getMembershipCollection()`
- `abstract Team.EnumVisible getNameTagVisibility()`
- `abstract java.lang.String getRegisteredName()` — Retrieve the name by which this team is registered in the scoreboard
- `abstract boolean getSeeFriendlyInvisiblesEnabled()`
- `boolean isSameTeam(Team other)` — Same as ==
