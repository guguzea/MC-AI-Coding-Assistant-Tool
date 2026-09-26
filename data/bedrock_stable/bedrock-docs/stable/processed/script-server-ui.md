> 来源：https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/minecraft-server-ui?view=minecraft-bedrock-stable
> 抓取时间：2026-09-24T02:07:37.850Z
> 警告：此文档可能滞后于当前正式版

# @minecraft/server-ui Module

The `@minecraft/server-ui` module contains types for expressing simple dialog-based user experiences.

- @minecraft/server-ui.ActionFormData contain a list of buttons with captions and images that can be used for presenting a set of options to a player.

- @minecraft/server-ui.MessageFormData are simple two-button message experiences that are functional for Yes/No or OK/Cancel questions.

- @minecraft/server-ui.ModalFormData allow for a more flexible "questionnaire-style" list of controls that can be used to take input.

## Changelog

## Manifest Details

```json
{
 "module_name": "@minecraft/server-ui",
 "version": "2.2.0"
}
```

This is version 2.x.x of this module, which is the latest as of version 1.26.60-beta.28 of Minecraft.

## Available Versions

- 2.4.0-beta.1.26.60-preview.28

- 2.3.0-rc.1.26.60-preview.28

- 2.2.0

- 2.1.0

- 2.0.0

### Prior Versions

The following API versions are from a major version that is documented here: @minecraft/server-ui :

- 1.3.0

- 1.2.0

- 1.1.0

- 1.0.0

## Enumerations

- DataDrivenScreenClosedReason

- FormCancelationReason

- FormRejectReason

- FormVisibilityErrorReason

- TextFilteringError

## Classes

- ActionFormData

- ActionFormResponse

- CustomForm

- FormResponse

- MessageBox

- MessageFormData

- MessageFormResponse

- ModalFormData

- ModalFormResponse

- ObservableBoolean

- ObservableNumber

- ObservableString

- ObservableUIRawMessage

- UIManager

## Interfaces

- ButtonData

- ButtonOptions

- CustomFormOptions

- DividerOptions

- DropdownItemData

- DropdownOptions

- ImageDetails

- ImageOptions

- MessageBoxBodyOptions

- MessageBoxButtonOptions

- MessageBoxOptions

- MessageBoxResult

- ModalFormDataDropdownOptions

- ModalFormDataSliderOptions

- ModalFormDataTextFieldOptions

- ModalFormDataToggleOptions

- MultiButtonRowOptions

- ObservableOptions

- SliderOptions

- SpacingOptions

- TextFieldOptions

- TextOptions

- ToggleOptions

- UIRawMessage

## Errors

- FormRejectError

- FormVisibilityError

- InvalidFormError

- InvalidFormModificationError

- InvalidObservableError

- PlayerLeftError

## Objects

### uiManager

`static read-only uiManager: UIManager;`

Type: UIManager

## Peer Dependencies

- @minecraft/common

- @minecraft/server

## Feedback

 Want to try using Ask Learn to clarify or guide you through this topic?
