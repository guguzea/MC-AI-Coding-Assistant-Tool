> 来源：https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server-ui/minecraft-server-ui?view=minecraft-bedrock-stable
> 抓取时间：2026-08-14T18:35:35.549Z
> 警告：此文档可能滞后于当前正式版

minecraft/server-ui Module | Microsoft Learn
			Skip to main content
			Skip to Ask Learn chat experience
					 This browser is no longer supported.
						Upgrade to Microsoft Edge to take advantage of the latest features, security updates, and technical support.
							Download Microsoft Edge
							More info about Internet Explorer and Microsoft Edge
				  Table of contents
				 Exit editor mode
			 Ask Learn
			 Ask Learn
			 Reading mode
			 Table of contents
			 Read in English
			 Add
			 Add to Plans
			 Edit
					 Copy Markdown
					 Print
						 Note
						Access to this page requires authorization. You can try  signing in  or  changing directories .
						Access to this page requires authorization. You can try  changing directories .
					   @minecraft/server-ui  Module
			 Feedback
						Summarize this article for me
				In this article
					  The  @minecraft/server-ui  module contains types for expressing simple dialog-based user experiences.
    @minecraft/server-ui.ActionFormData   contain a list of buttons with captions and images that can be used for presenting a set of options to a player.
    @minecraft/server-ui.MessageFormData   are simple two-button message experiences that are functional for Yes/No or OK/Cancel questions.
    @minecraft/server-ui.ModalFormData   allow for a more flexible "questionnaire-style" list of controls that can be used to take input.
  Changelog
 Manifest Details
  {
    "module_name": "@minecraft/server-ui",
    "version": "2.1.0"
}
 This is version 2.x.x of this module, which is the latest as of version 1.26.50-beta.25 of Minecraft.
 Available Versions
  2.3.0-beta.1.26.50-preview.25
  2.2.0-rc.1.26.50-preview.25
  2.1.0
  2.0.0
 Prior Versions
 The following API versions are from a major version that is documented here:   @minecraft/server-ui  :
  1.3.0
  1.2.0
  1.1.0
  1.0.0
 Enumerations
  DataDrivenScreenClosedReason
  FormCancelationReason
  FormRejectReason
  FormVisibilityErrorReason
  TextFilteringError
 Classes
  ActionFormData
  ActionFormResponse
  CustomForm
  FormResponse
  MessageBox
  MessageFormData
  MessageFormResponse
  ModalFormData
  ModalFormResponse
  ObservableBoolean
  ObservableNumber
  ObservableString
  ObservableUIRawMessage
  UIManager
 Interfaces
  ButtonOptions
  DividerOptions
  DropdownItemData
  DropdownOptions
  ImageDetails
  ImageOptions
  MessageBoxButtonOptions
  MessageBoxResult
  ModalFormDataDropdownOptions
  ModalFormDataSliderOptions
  ModalFormDataTextFieldOptions
  ModalFormDataToggleOptions
  ObservableOptions
  SliderOptions
  SpacingOptions
  TextFieldOptions
  TextOptions
  ToggleOptions
  UIRawMessage
 Errors
  FormRejectError
  FormVisibilityError
  InvalidFormError
  InvalidFormModificationError
  InvalidObservableError
  PlayerLeftError
 Objects
  uiManager
  static read-only uiManager: UIManager;
 Type:   UIManager
 Peer Dependencies
   @minecraft/common
   @minecraft/server
			 Feedback
					Was this page helpful?
						 Yes
						 No
							 No
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
				Additional resources
				 Last updated on
		2026-07-21
			 In this article
					Was this page helpful?
								Need help with this topic?
								Want to try using Ask Learn to clarify or guide you through this topic?
			 Ask Learn
			 Ask Learn
				  Suggest a fix?
		      en-us
			 Your Privacy Choices
				 Theme
							  Light
							  Dark
							  High contrast
		 AI Disclaimer
		 Previous Versions
		 Blog
		 Contribute
		 Privacy
		 Consumer Health Privacy
		 Terms of Use
		 Trademarks
				 &copy; Microsoft 2026
