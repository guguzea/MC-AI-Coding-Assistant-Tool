# GuiMultiplayer

**Inheritance:** java.lang.Object → net.minecraft.client.gui.Gui → net.minecraft.client.gui.GuiScreen → net.minecraft.client.gui.GuiMultiplayer

## Class signature

```java
public class GuiMultiplayer extends GuiScreen implements GuiYesNoCallback
```

## Methods

- `protected void actionPerformed(GuiButton button)` — Called by the controls from the buttonList when activated.
- `void confirmClicked(boolean result, int id)`
- `void connectToSelected()`
- `void createButtons()`
- `void drawScreen(int mouseX, int mouseY, float partialTicks)` — Draws the screen and all the components in it.
- `void func_175391_a(ServerListEntryNormal p_175391_1_, int p_175391_2_, boolean p_175391_3_)`
- `boolean func_175392_a(ServerListEntryNormal p_175392_1_, int p_175392_2_)`
- `void func_175393_b(ServerListEntryNormal p_175393_1_, int p_175393_2_, boolean p_175393_3_)`
- `boolean func_175394_b(ServerListEntryNormal p_175394_1_, int p_175394_2_)`
- `OldServerPinger getOldServerPinger()`
- `ServerList getServerList()`
- `void handleMouseInput()` — Handles mouse input.
- `void initGui()` — Adds the buttons (and other controls) to the screen in question.
- `protected void keyTyped(char typedChar, int keyCode)` — Fired when a key is typed (except F11 which toggles full screen).
- `protected void mouseClicked(int mouseX, int mouseY, int mouseButton)` — Called when the mouse is clicked.
- `protected void mouseReleased(int mouseX, int mouseY, int state)` — Called when a mouse button is released.
- `void onGuiClosed()` — Called when the screen is unloaded.
- `void selectServer(int index)`
- `void setHoveringText(java.lang.String p_146793_1_)`
- `void updateScreen()` — Called from the main game loop to update the screen.

## Fields

- `GuiMultiplayer`