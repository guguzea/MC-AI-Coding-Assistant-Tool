# Custom Widgets

> 来源：https://raw.githubusercontent.com/FabricMC/fabric-docs/main/versions/26.1.2/develop/rendering/gui/custom-widgets.md
> 版本：26.1.2
> GitHub 路径：develop/rendering/gui/custom-widgets.md
> 抓取源：github_raw_versioned
> 抓取时间：2026-08-20T09:52:52.153Z
> SHA256：3d1afb3a2acff38de4a64d7272bafcd9316c16623d8cf297f5eb333d5a3f931d
> 分支：main

---
title: Custom Widgets
description: Learn how to create custom widgets for your screens.
authors:
  - IMB11
---

Widgets are essentially containerized rendering components that can be added to a screen, and can be interacted with by the player through various events such as mouse clicks, key presses, and more.

## Creating a Widget {#creating-a-widget}

There are multiple ways to create a widget class, such as extending `AbstractWidget`. This class provides a lot of useful utilities, such as managing width, height, position, and handling events - it implements the `Renderable`, `GuiEventListener`, `NarrationSupplier`, and `NarratableEntry` interfaces:

- `Renderable` - for rendering - Required to register the widget to the screen via the `addRenderableWidget` method.
- `GuiEventListener` - for events - Required if you want to handle events such as mouse clicks, key presses, and more.
- `NarrationSupplier` - for accessibility - Required to make your widget accessible to screen readers and other accessibility tools.
- `NarratableEntry` - for selection - Required if you want to make your widget selectable using the <kbd>Tab</kbd> key - this also aids in accessibility.

<<< @/reference/26.1.2/src/client/java/com/example/docs/rendering/screens/CustomWidget.java#widget

## Adding the Widget to the Screen {#adding-the-widget-to-the-screen}

Like all widgets, you need to add it to the screen using the `addRenderableWidget` method, which is provided by the `Screen` class. Make sure you do this in the `init` method.

<<< @/reference/26.1.2/src/client/java/com/example/docs/rendering/screens/CustomScreen.java#add_custom_widget

![Custom widget on screen](/assets/develop/rendering/gui/custom-widget-example.png)

## Widget Events {#widget-events}

You can handle events such as mouse clicks, key presses, by overriding the `mouseClicked`, `afterMouseAction`, `keyPressed`, and other methods.

For example, you can make the widget change color when it's hovered over by using the `isHovered()` method provided by the `AbstractWidget` class:

<<< @/reference/26.1.2/src/client/java/com/example/docs/rendering/screens/CustomWidget.java#on_hover_event

![Hover Event Example](/assets/develop/rendering/gui/custom-widget-events.webp)
