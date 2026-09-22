> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/bedrockeditor/editorstructures?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:30.379Z
> 警告：此文档可能滞后于当前正式版

# Structures

The Structures panel is designed to hold structures so you can move them to and from the clipboard. This helps you rapidly build complex scenes by stamping prebuilt structures instead of relying on copy/paste or rebuilding them each from scratch.

The Structures Panel is routinely synchronized, so you'll also be able to see and use the structures that other players save in your world.

Tip

Advanced workflows like EditorStructure, EditorStructureManager, and StructureSource use the Editor Structures API. These workflows power features like tags, search by name/ID, and creating from clipboard content.

The Structures panel isn't added to the Action Bar by default. Click the + button to add it.

## Saving a structure

- Select the area or structure in the world you want to save.

- Press Ctrl+C to copy the selection to your clipboard.

- From Structures, name your structure and click New from Clipboard .

Tip

When editing a Prefab template, changes to structure offset, rotation, and mirror settings are auto-saved. There is no manual save button — your modifications are persisted automatically after a brief delay.

## Placing a structure

- From Structures, check the box next to the structure you want to use.

- Click Copy to Clipboard .

- Press Ctrl+Shift+V to begin Paste Preview.

- Position, rotate, and mirror as needed, then right-click to place the structure.

### Structure management

Use our built in structure management tools to help you find structures faster:

- Tags Add or edit tags to group related items and make them easier to find when searching for your older structures. Tags can also help create areas in your worlds that have the same look/feel (like a village made with similar blocks and buildings).

- Search You can refine your search by filtering by display name or ID pattern, tags (i.e. "roofs", "terrain", ets), or source (i.e. project, world/level, Behavior Pack, or file-imported entries).

- Naming You can rename structures to help you remember them later. You can also use the naming tool to delete previously saved structures.

## Keyboard shortcuts

These shortcuts support common Structures workflows. Check out Editor Hotkeys for a full list of shortcuts.

 Name
 Shortcut
 Description

 Copy Selection
 Ctrl+C
 Copies the current selection to the clipboard

 Paste Preview
 Ctrl+Shift+V
 Opens Paste Preview from clipboard

 Paste at Cursor (Paste Preview)
 Ctrl+F
 Commits the paste at the cursor target

 Clear Preview (Paste Preview)
 Ctrl+D
 Clears the current preview

 Rotate Preview Clockwise (Paste Preview)
 R
 While in Paste Preview

 Rotate Preview Counter Clockwise (Paste Preview)
 Shift+R
 While in Paste Preview

Paste Preview also supports moving and mirroring the preview with arrow keys, PgUp/PgDn, X, and Z. Refer to the Paste Preview section in Editor Hotkeys for the complete list.

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
