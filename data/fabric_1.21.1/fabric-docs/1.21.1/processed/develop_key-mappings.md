
# Key Mappings 26.1.2 ​
Creating key mappings and reacting to them.Minecraft handles user input from peripherals such as the keyboard and mouse using key mappings. Many of these key mappings can be configured through the settings menu.

With help of Fabric API, you can create your own custom key mappings and react to them in your mod.

Key mappings only exist on the client side. This means that registration and reacting to key mappings should be done on the client side. You can use the client initializer for this.

## Creating a Key Mapping ​
A key mapping consists of two parts: the mapping to a key, and the category it belongs to.

Let's start with creating a category. A category defines a group of key mappings that will be shown together in the settings menu.

javaKeyMapping.Category CATEGORY = KeyMapping.Category.register(
		Identifier.fromNamespaceAndPath(ExampleMod.MOD_ID, "custom_category")
);123Next, we can create a key mapping. We will be using Fabric API's KeyMappingHelper to register our key mapping at the same time.

javaKeyMapping sendToChatKey = KeyMappingHelper.registerKeyMapping(
	new KeyMapping(
			"key.example-mod.send_to_chat", // The translation key for the key mapping.
			InputConstants.Type.KEYSYM, // The type of the keybinding; KEYSYM for keyboard, MOUSE for mouse.
			GLFW.GLFW_KEY_J, // The GLFW keycode of the key.
			this.CATEGORY // The category of the mapping.
	));1234567INFONote that the names of the key tokens (GLFW.GLFW_KEY_*) assume a standard US layout.

This means that if you're using an AZERTY layout, pressing on A would yield GLFW.GLFW_KEY_Q.

Sticky keys can also be created with KeyMappingHelper by passing a ToggleKeyMapping instance instead of a KeyMapping.

Once registered, you can find your key mappings in Options > Controls > Key Binds.

## Translations ​
You'll need to provide translations for both the key mapping and the category.

Category name translation key takes the form of key.category... The key mapping translation key will be the one you provided when creating the key mapping.

Translations can be added manually or using data generation.

json{
  "key.category.example-mod.custom_category": "Example Mod Custom Category",
  "key.example-mod.send_to_chat": "Send to Chat"
}1234

## Reacting to Key Mappings ​
Now that we have a key mapping, we can react to it using a client tick event.

javaClientTickEvents.END_CLIENT_TICK.register(client -> {
	while (this.sendToChatKey.consumeClick()) {
		if (client.player != null) {
			client.player.sendSystemMessage(Component.literal("Key Pressed!"));
		}
	}
});1234567This will print "Key Pressed!" to the in-game chat every time the mapped key is pressed. Keep in mind that holding the key will repeatedly print the message to the chat, so you might want to implement guards if this logic only needs to trigger once.

Copied