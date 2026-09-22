# GuiPlayerTabOverlay

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiPlayerTabOverlay

## Class signature

```java
public class GuiPlayerTabOverlay extends Gui
```

## Methods

- `protected void drawPing(int p_175245_1_, int p_175245_2_, int p_175245_3_, NetworkPlayerInfo networkPlayerInfoIn)`
- `void func_181030_a()`
- `java.lang.String getPlayerName(NetworkPlayerInfo networkPlayerInfoIn)` — Returns the name that should be renderd for the player supplied
- `void renderPlayerlist(int width, Scoreboard scoreboardIn, ScoreObjective scoreObjectiveIn)` — Renders the playerlist, its background, headers and footers.
- `void setFooter(IChatComponent footerIn)`
- `void setHeader(IChatComponent headerIn)`
- `void updatePlayerList(boolean willBeRendered)` — Called by GuiIngame to update the information stored in the playerlist, does not actually render the list, however.

## Fields

- `GuiPlayerTabOverlay`