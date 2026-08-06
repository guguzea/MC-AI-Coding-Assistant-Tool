
# Custom Screens 26.1.2 ​
Learn how to create custom screens for your mod.INFOThis page refers to normal screens, not menus - these screens are the ones that are opened by the player on the client, not the ones that are handled by the server.

Screens are essentially the GUIs that the player interacts with, such as the title screen, pause screen etc.

You can create your own screens to display custom content, a custom settings menu, or more.

## Creating a Screen ​
To create a screen, you need to extend the Screen class and override the init method - you may optionally override the extractRenderState method as well, but make sure to call its super method or it won't render the background, widgets etc.

You should take note that:

- Widgets are not being created in the constructor because the screen is not yet initialized at that point - and certain variables, such as width and height, are not yet available or not yet accurate.
- The init method is called when the screen is being initialized, and it is the best place to create widgets. You add widgets using the addRenderableWidget method, which accepts any drawable widget.
The `extractRenderState` method is called every frame - you can access the GUI graphics extractor and the mouse position from this method.As an example, we can create a simple screen that has a button and a label above it.

javapublic class CustomScreen extends Screen {
	public CustomScreen(Component title) {
		super(title);
	}

	@Override
	protected void init() {
		Button buttonWidget = Button.builder(Component.literal("Hello World"), (btn) -> {
			// When the button is clicked, we can display a toast to the screen.
			this.minecraft.getToastManager().addToast(
					SystemToast.multiline(this.minecraft, SystemToast.SystemToastId.NARRATOR_TOGGLE, Component.nullToEmpty("Hello World!"), Component.nullToEmpty("This is a toast."))
			);
		}).bounds(40, 40, 120, 20).build();
		// x, y, width, height
		// It's recommended to use the fixed height of 20 to prevent rendering issues with the button
		// textures.

		// Register the button widget.
		this.addRenderableWidget(buttonWidget);

	}

	@Override
	public void extractRenderState(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta) {
		super.extractRenderState(graphics, mouseX, mouseY, delta);

		// Minecraft doesn't have a "label" widget, so we'll have to draw our own text.
		// We'll subtract the font height from the Y position to make the text appear above the button.
		// Subtracting an extra 10 pixels will give the text some padding.
		// font, text, x, y, color, hasShadow
		graphics.text(this.font, "Special Button", 40, 40 - this.font.lineHeight - 10, 0xFFFFFFFF, true);
	}
}123456789101112131415161718192021222324252627282930313233

## Opening the Screen ​
You can open the screen using the Minecraft's setScreen method - you can do this from many places, such as a key binding, a command, or a client packet handler.

javaMinecraft.getInstance().setScreen(
  new CustomScreen(Component.empty())
);123
## Closing the Screen ​
If you want to close the screen, simply set the screen to null:

javaMinecraft.getInstance().setScreen(null);1If you want to be fancy and return to the previous screen, you can pass the current screen into the CustomScreen constructor and store it in a field, then use it to return to the previous screen when the close method is called.

javapublic Screen parent;
public CustomScreen(Component title, Screen parent) {
	super(title);
	this.parent = parent;
}

@Override
public void onClose() {
	this.minecraft.setScreen(this.parent);
}12345678910Now, when opening the custom screen, you can pass the current screen as the second argument - so when you call CustomScreen#close, it will return to the previous screen.

javaScreen currentScreen = Minecraft.getInstance().currentScreen;
Minecraft.getInstance().setScreen(
  new CustomScreen(Component.empty(), currentScreen)
);1234Copied