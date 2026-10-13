/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.gui;

import static com.mumfrey.liteloader.gl.GL.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.lwjgl.input.Keyboard;
import org.lwjgl.input.Mouse;

import com.mumfrey.liteloader.LiteMod;
import com.mumfrey.liteloader.api.BrandingProvider;
import com.mumfrey.liteloader.api.LiteAPI;
import com.mumfrey.liteloader.api.ModInfoDecorator;
import com.mumfrey.liteloader.client.api.LiteLoaderBrandingProvider;
import com.mumfrey.liteloader.core.LiteLoader;
import com.mumfrey.liteloader.core.LiteLoaderMods;
import com.mumfrey.liteloader.core.LiteLoaderVersion;
import com.mumfrey.liteloader.core.ModInfo;
import com.mumfrey.liteloader.core.api.LiteLoaderCoreAPI;
import com.mumfrey.liteloader.launch.LoaderEnvironment;
import com.mumfrey.liteloader.launch.LoaderProperties;
import com.mumfrey.liteloader.modconfig.ConfigManager;
import com.mumfrey.liteloader.modconfig.ConfigPanel;
import com.mumfrey.liteloader.util.render.Icon;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.FontRenderer;
import net.minecraft.client.gui.GuiButton;
import net.minecraft.client.gui.GuiMainMenu;
import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.renderer.Tessellator;
import net.minecraft.client.renderer.BufferBuilder;
import net.minecraft.client.resources.I18n;
import net.minecraft.util.ResourceLocation;

/**
 * GUI screen which displays info about loaded mods and also allows them to be
 * enabled and disabled. An instance of this class is created every time the
 * main menu is displayed and is drawn as an overlay until the tab is clicked,
 * at which point it becomes the active GUI screen and draws the parent main
 * menu screen as its background to give the appearance of being overlaid on the
 * main menu.
 *
 * @author Adam Mummery-Smith
 */
public class GuiLiteLoaderPanel extends GuiScreen
{
    static final int WHITE                           = 0xFFFFFFFF;
    static final int OPAQUE                          = 0xFF000000;
    static final int NOTIFICATION_TOOLTIP_FOREGROUND = 0xFFFFFF;
    static final int NOTIFICATION_TOOLTIP_BACKGROUND = 0xB0000099;
    static final int ERROR_TOOLTIP_FOREGROUND        = 0xFF5555;
    static final int ERROR_TOOLTIP_BACKGROUND        = 0xB0330000;
    static final int HEADER_HR_COLOUR                = 0xFF999999;
    static final int HEADER_TEXT_COLOUR              = GuiLiteLoaderPanel.WHITE;
    static final int HEADER_TEXT_COLOUR_SUB          = 0xFFAAAAAA;
    static final int TOOLTIP_FOREGROUND              = 0xFFFFFF;
    static final int TOOLTIP_FOREGROUND_SUB          = 0xCCCCCC;
    static final int TOOLTIP_BACKGROUND              = 0xB0000000;
    
    static final int LEFT_EDGE                       = 80;
    static final int MARGIN                          = 12;
    static final int TAB_WIDTH                       = 20;
    static final int TAB_HEIGHT                      = 40;
    static final int TAB_TOP                         = 20;
    static final int PANEL_TOP                       = 83;
    static final int PANEL_BOTTOM                    = 26;

    private static final double TWEEN_RATE = 0.08;

    private static boolean displayErrorToolTip = true;

    /**
     * Reference to the main menu which this screen is either overlaying or
     * using as its background.
     */
    private GuiScreen parentScreen;

    @SuppressWarnings("unused")
    private final LoaderEnvironment environment;

    private final LoaderProperties properties;

    /**
     * Tick number (update counter) used for tweening
     */
    private long tickNumber;

    /**
     * Last tick number, for tweening
     */
    private double lastTick;

    /**
     * Current tween percentage (0.0 -> 1.0)
     */
    private double tweenAmount = 0.0;

    /**
     * Since we don't get real mouse events we have to simulate them by tracking
     * the mouse state.
     */
    private boolean mouseDown, toggled, toggleable;

    /**
     * Hover opacity for the tab
     */
    private float tabOpacity = 0.0F;

    private boolean showTab = true;

    /**
     * Text to display under the header
     */
    private String activeModText, versionText;

    /**
     * Configuration panel
     */
    private GuiPanel currentPanel;

    private final GuiPanelMods modsPanel;
    private final GuiPanelSettings settingsPanel;

    private int brandColour = LiteLoaderBrandingProvider.BRANDING_COLOUR;

    private ResourceLocation logoResource = LiteLoaderBrandingProvider.ABOUT_TEXTURE;
    private Icon logoCoords = LiteLoaderBrandingProvider.LOGO_COORDS;

    private ResourceLocation iconResource = LiteLoaderBrandingProvider.ABOUT_TEXTURE;
    private Icon iconCoords = LiteLoaderBrandingProvider.ICON_COORDS;

    private List<ModInfoDecorator> modInfoDecorators = new ArrayList<ModInfoDecorator>();

    private boolean mouseOverLogo = false;

    private int startupErrorCount = 0, criticalErrorCount = 0;

    private String notification;

    private boolean isSnapshot;

    /**
     * @param minecraft
     * @param parentScreen
     * @param mods
     */
    public GuiLiteLoaderPanel(Minecraft minecraft, GuiScreen parentScreen, LiteLoaderMods mods, LoaderEnvironment environment,
            LoaderProperties properties, ConfigManager configManager, boolean showTab)
    {
        this.field_146297_k              = minecraft;
        this.field_146289_q    = minecraft.field_71466_p;
        this.parentScreen    = parentScreen;
        this.showTab         = showTab;

        this.environment     = environment;
        this.properties      = properties;

        this.toggleable      = true;

        this.versionText = I18n.func_135052_a("gui.about.versiontext", LiteLoader.getVersion());
        this.activeModText = I18n.func_135052_a("gui.about.modsloaded", LiteLoader.getLoadedModsCount());

        this.initBranding();

        this.currentPanel = this.modsPanel = new GuiPanelMods(this, minecraft, mods, environment, configManager,
                this.brandColour, this.modInfoDecorators);
        this.settingsPanel = new GuiPanelSettings(this, minecraft);

        this.startupErrorCount = mods.getStartupErrorCount();
        this.criticalErrorCount = mods.getCriticalErrorCount();

        this.isSnapshot = LiteLoader.isSnapshot();
        if (this.isSnapshot)
        {
            this.versionText = "\247c" + LiteLoader.getBranding();
        }
    }

    /**
     * 
     */
    private void initBranding()
    {
        LiteAPI logoProvider = null;

        int brandingColourProviderPriority = Integer.MIN_VALUE;
        int logoProviderPriority = Integer.MIN_VALUE;
        int iconProviderPriority = Integer.MIN_VALUE;

        for (LiteAPI api : LiteLoader.getAPIs())
        {
            BrandingProvider brandingProvider = LiteLoader.getCustomisationProvider(api, BrandingProvider.class);
            if (brandingProvider != null)
            {
                if (brandingProvider.getBrandingColour() != 0 && brandingProvider.getPriority() > brandingColourProviderPriority)
                {
                    brandingColourProviderPriority = brandingProvider.getPriority();
                    this.brandColour = GuiLiteLoaderPanel.OPAQUE | brandingProvider.getBrandingColour();
                }

                ResourceLocation logoResource = brandingProvider.getLogoResource();
                Icon logoCoords = brandingProvider.getLogoCoords();
                if (logoResource != null && logoCoords != null && brandingProvider.getPriority() > logoProviderPriority)
                {
                    logoProvider = api;
                    logoProviderPriority = brandingProvider.getPriority();
                    this.logoResource = logoResource;
                    this.logoCoords = logoCoords;
                }

                ResourceLocation iconResource = brandingProvider.getIconResource();
                Icon iconCoords = brandingProvider.getIconCoords();
                if (iconResource != null && iconCoords != null && brandingProvider.getPriority() > iconProviderPriority)
                {
                    iconProviderPriority = brandingProvider.getPriority();
                    this.iconResource = iconResource;
                    this.iconCoords = iconCoords;
                }
            }

            ModInfoDecorator modInfoDecorator = LiteLoader.getCustomisationProvider(api, ModInfoDecorator.class);
            if (modInfoDecorator != null)
            {
                this.modInfoDecorators.add(modInfoDecorator);
            }
        }

        if (logoProvider != null && !LiteLoaderCoreAPI.class.isAssignableFrom(logoProvider.getClass()))
        {
            this.versionText = I18n.func_135052_a("gui.about.poweredbyversion", logoProvider.getVersion(), LiteLoader.getVersion());
        }
    }

    /**
     * Get the computed branding colour
     */
    public int getBrandColour()
    {
        return this.brandColour;
    }

    /**
     * Release references prior to being disposed
     */
    public void release()
    {
        this.parentScreen = null;
    }

    /**
     * Get the parent menu
     */
    public GuiScreen getScreen()
    {
        return this.parentScreen;
    }

    /**
     * Return true if the panel is not fully closed (tweening or open)
     */
    public boolean isOpen()
    {
        return this.tweenAmount > 0.0;
    }

    public void setToggleable(boolean toggleable)
    {
        this.toggleable = toggleable;
    }

    public void setNotification(String notification)
    {
        this.notification = notification;
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#initGui()
     */
    @Override
    public void func_73866_w_()
    {
        // Hide the tooltip once the user opens the panel
        GuiLiteLoaderPanel.displayErrorToolTip = false;

        this.currentPanel.setSize(this.field_146294_l - LEFT_EDGE, this.field_146295_m);

        this.field_146292_n.add(new GuiHoverLabel(2, LEFT_EDGE + MARGIN, this.field_146295_m - PANEL_BOTTOM + 9, this.field_146289_q,
                I18n.func_135052_a("gui.about.taboptions"), this.brandColour));

        if (LiteLoaderVersion.getUpdateSite().canCheckForUpdate() && this.field_146297_k.field_71441_e == null && !this.isSnapshot)
        {
            this.field_146292_n.add(new GuiHoverLabel(3, LEFT_EDGE + MARGIN + 38 + this.field_146289_q.func_78256_a(this.versionText) + 6, 50,
                    this.field_146289_q, I18n.func_135052_a("gui.about.checkupdates"), this.brandColour));
        }

        Keyboard.enableRepeatEvents(true);
    }

    @Override
    public void func_146281_b()
    {
        Keyboard.enableRepeatEvents(false);
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen
     *      #setWorldAndResolution(net.minecraft.client.Minecraft, int, int)
     */
    @Override
    public void func_146280_a(Minecraft minecraft, int width, int height)
    {
        if (this.field_146297_k.field_71462_r == this)
        {
            // Set res in parent screen if we are the active GUI
            this.parentScreen.func_146280_a(minecraft, width, height);
        }

        super.func_146280_a(minecraft, width, height);
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#updateScreen()
     */
    @Override
    public void func_73876_c()
    {
        this.currentPanel.onTick();

        this.tickNumber++;

        if (this.field_146297_k.field_71462_r == this)
        {
            this.field_146297_k.field_71462_r = this.parentScreen;
            this.parentScreen.func_73876_c();
            this.field_146297_k.field_71462_r = this;
        }

        if (this.toggled && this.toggleable)
        {
            this.onToggled();
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#drawScreen(int, int, float)
     */
    @Override
    public void func_73863_a(int mouseX, int mouseY, float partialTicks)
    {
        this.drawScreen(mouseX, mouseY, partialTicks, false);
    }

    /**
     * @param mouseX
     * @param mouseY
     * @param partialTicks
     * @param alwaysExpandTab
     */
    public void drawScreen(int mouseX, int mouseY, float partialTicks, boolean alwaysExpandTab)
    {
        boolean active = this.field_146297_k.field_71462_r == this;

        if (active)
        {
            // Draw the parent screen as our background if we are the active screen
            glClear(GL_DEPTH_BUFFER_BIT);
            this.parentScreen.func_73863_a(-10, -10, partialTicks);
            glClear(GL_DEPTH_BUFFER_BIT);
        }
        else
        {
            // If this is not the active screen, copy the width and height from the parent GUI
            this.field_146294_l = this.parentScreen.field_146294_l;
            this.field_146295_m = this.parentScreen.field_146295_m;
        }

        // Calculate the current tween position
        float xOffset = (this.field_146294_l - LEFT_EDGE) * this.calcTween(partialTicks, active) + 16.0F + (this.tabOpacity * -32.0F);
        int offsetMouseX = mouseX - (int)xOffset;

        // Handle mouse stuff here since we won't get mouse events when not the active GUI
        boolean mouseOverTab = this.showTab && (offsetMouseX > LEFT_EDGE - TAB_WIDTH
                                                && offsetMouseX < LEFT_EDGE
                                                && mouseY > TAB_TOP
                                                && mouseY < TAB_TOP + TAB_HEIGHT);
        this.handleMouseClick(offsetMouseX, mouseY, partialTicks, active, mouseOverTab);

        // Calculate the tab opacity, not framerate adjusted because we don't really care
        this.tabOpacity = mouseOverTab || alwaysExpandTab || this.startupErrorCount > 0 || this.notification != null
                || this.isOpen() ? 0.5F : Math.max(0.0F, this.tabOpacity - partialTicks * 0.1F);

        // Draw the panel contents
        this.drawPanel(offsetMouseX, mouseY, partialTicks, active, xOffset);
        this.drawTooltips(mouseX, mouseY, partialTicks, active, xOffset, mouseOverTab);
    }

    /**
     * @param mouseX
     * @param mouseY
     * @param partialTicks
     * @param active
     * @param xOffset
     */
    private void drawPanel(int mouseX, int mouseY, float partialTicks, boolean active, float xOffset)
    {
        this.mouseOverLogo = false;

        glBlendFuncSeparate(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ZERO);

        glPushMatrix();
        glTranslatef(xOffset, 0.0F, 0.0F);

        // Draw the background and left edge
        func_73734_a(LEFT_EDGE, 0, this.field_146294_l, this.field_146295_m, GuiLiteLoaderPanel.TOOLTIP_BACKGROUND);

        if (this.showTab)
        {
            func_73734_a(LEFT_EDGE, 0, LEFT_EDGE + 1, TAB_TOP, GuiLiteLoaderPanel.WHITE);
            func_73734_a(LEFT_EDGE, TAB_TOP + TAB_HEIGHT, LEFT_EDGE + 1, this.field_146295_m, GuiLiteLoaderPanel.WHITE);

            this.field_146297_k.func_110434_K().func_110577_a(LiteLoaderBrandingProvider.ABOUT_TEXTURE);
            glDrawTexturedRect(LEFT_EDGE - TAB_WIDTH, TAB_TOP, TAB_WIDTH + 1, TAB_HEIGHT, 80, 80, 122, 160, 0.5F + this.tabOpacity);
            if (this.startupErrorCount > 0)
            {
                glDrawTexturedRect(LEFT_EDGE - TAB_WIDTH + 7, TAB_TOP + 2, 12, 12, 134, 92, 134 + 12, 92 + 12, 0.5F + this.tabOpacity);
            }
            else if (this.notification != null)
            {
                glDrawTexturedRect(LEFT_EDGE - TAB_WIDTH + 7, TAB_TOP + 2, 12, 12, 134 + 12, 92, 134 + 24, 92 + 12, 0.5F + this.tabOpacity);
            }
        }
        else
        {
            func_73734_a(LEFT_EDGE, 0, LEFT_EDGE + 1, this.field_146295_m, GuiLiteLoaderPanel.WHITE);
        }

        // Only draw the panel contents if we are actually open
        if (this.isOpen())
        {
            if (this.currentPanel.isCloseRequested())
            {
                this.closeCurrentPanel();
            }

            this.drawCurrentPanel(mouseX, mouseY, partialTicks);

            if (!this.currentPanel.stealFocus())
            {
                // Draw other controls inside the transform so that they slide properly
                super.func_73863_a(mouseX, mouseY, partialTicks);
            }
        }
        else
        {
            this.closeCurrentPanel();
        }

        glPopMatrix();
    }

    /**
     * @param mouseX
     * @param mouseY
     * @param partialTicks
     */
    private void drawCurrentPanel(int mouseX, int mouseY, float partialTicks)
    {
        glPushMatrix();
        glTranslatef(LEFT_EDGE, 0, 0);

        this.currentPanel.draw(mouseX - LEFT_EDGE, mouseY, partialTicks);

        glPopMatrix();
    }

    /**
     * @param mouseX
     * @param mouseY
     * @param partialTicks
     */
    protected boolean drawInfoPanel(int mouseX, int mouseY, float partialTicks, int left, int bottom)
    {
        int right = this.field_146294_l - MARGIN - LEFT_EDGE + left;
        left += MARGIN;

        // Draw the header pieces
        this.field_146297_k.func_110434_K().func_110577_a(this.logoResource);
        glDrawTexturedRect(left, MARGIN, this.logoCoords, 1.0F);
        this.field_146297_k.func_110434_K().func_110577_a(this.iconResource);
        glDrawTexturedRect(right - this.iconCoords.getIconWidth(), MARGIN, this.iconCoords, 1.0F);

        // Draw header text
        this.field_146289_q.func_78276_b(this.versionText, left + 38, 50, GuiLiteLoaderPanel.HEADER_TEXT_COLOUR);
        this.field_146289_q.func_78276_b(this.activeModText, left + 38, 60, GuiLiteLoaderPanel.HEADER_TEXT_COLOUR_SUB);

        // Draw top and bottom horizontal rules
        func_73734_a(left, 80, right, 81, GuiLiteLoaderPanel.HEADER_HR_COLOUR);
        func_73734_a(left, this.field_146295_m - bottom + 2, right, this.field_146295_m - bottom + 3, GuiLiteLoaderPanel.HEADER_HR_COLOUR);

        this.mouseOverLogo = (mouseY > MARGIN && mouseY < MARGIN + this.logoCoords.getIconHeight()
                && mouseX > left && mouseX < left + this.logoCoords.getIconWidth());
        return this.mouseOverLogo;
    }

    private void drawTooltips(int mouseX, int mouseY, float partialTicks, boolean active, float xOffset, boolean mouseOverTab)
    {
        boolean annoyingTip = this.startupErrorCount > 0 || this.notification != null;

        if (mouseOverTab && this.tweenAmount < 0.01)
        {
            GuiLiteLoaderPanel.drawTooltip(this.field_146289_q, LiteLoader.getVersionDisplayString(), mouseX, mouseY, this.field_146294_l, this.field_146295_m,
                    GuiLiteLoaderPanel.TOOLTIP_FOREGROUND, GuiLiteLoaderPanel.TOOLTIP_BACKGROUND);
            GuiLiteLoaderPanel.drawTooltip(this.field_146289_q, this.activeModText, mouseX, mouseY + 13, this.field_146294_l, this.field_146295_m,
                    GuiLiteLoaderPanel.TOOLTIP_FOREGROUND_SUB, GuiLiteLoaderPanel.TOOLTIP_BACKGROUND);

            if (annoyingTip)
            {
                GuiLiteLoaderPanel.displayErrorToolTip = false;
                this.drawNotificationTooltip(mouseX, mouseY - 13);
            }
        }
        else if (GuiLiteLoaderPanel.displayErrorToolTip && annoyingTip && !active && this.parentScreen instanceof GuiMainMenu)
        {
            this.drawNotificationTooltip((int)xOffset + LEFT_EDGE - 12, TAB_TOP + 2);
        }
    }

    private void drawNotificationTooltip(int left, int top)
    {
        if (this.startupErrorCount > 0)
        {
            GuiLiteLoaderPanel.drawTooltip(this.field_146289_q, I18n.func_135052_a("gui.error.tooltip", this.startupErrorCount, this.criticalErrorCount),
                    left, top, this.field_146294_l, this.field_146295_m, GuiLiteLoaderPanel.ERROR_TOOLTIP_FOREGROUND, GuiLiteLoaderPanel.ERROR_TOOLTIP_BACKGROUND);
        }
        else if (this.notification != null)
        {
            boolean isCritical = this.notification.startsWith("!!");
            String text = isCritical ? this.notification.substring(2) : this.notification;
            int bgColour = isCritical ? GuiLiteLoaderPanel.ERROR_TOOLTIP_BACKGROUND : GuiLiteLoaderPanel.NOTIFICATION_TOOLTIP_BACKGROUND;
            GuiLiteLoaderPanel.drawTooltip(this.field_146289_q, text, left, top, this.field_146294_l, this.field_146295_m,
                    GuiLiteLoaderPanel.NOTIFICATION_TOOLTIP_FOREGROUND, bgColour);
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen
     *      #actionPerformed(net.minecraft.client.gui.GuiButton)
     */
    @Override
    protected void func_146284_a(GuiButton button)
    {
        if (button.field_146127_k == 2)
        {
            this.setCurrentPanel(this.settingsPanel);
        }

        if (button.field_146127_k == 3)
        {
            this.setCurrentPanel(new GuiPanelUpdateCheck(this, this.field_146297_k, LiteLoaderVersion.getUpdateSite(), "LiteLoader", this.properties));
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#keyTyped(char, int)
     */
    @Override
    protected void func_73869_a(char keyChar, int keyCode)
    {
        this.currentPanel.keyPressed(keyChar, keyCode);
    }

    /**
     * 
     */
    void showLogPanel()
    {
        this.setCurrentPanel(new GuiPanelLiteLoaderLog(this.field_146297_k, this));
    }

    /**
     * 
     */
    void showAboutPanel()
    {
        this.setCurrentPanel(new GuiPanelAbout(this.field_146297_k, this));
    }

    public void showErrorPanel(ModInfo<?> mod)
    {
        this.setCurrentPanel(new GuiPanelError(this.field_146297_k, this, mod));
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#mouseClicked(int, int, int)
     */
    @Override
    protected void func_73864_a(int mouseX, int mouseY, int button) throws IOException
    {
        this.currentPanel.mousePressed(mouseX - LEFT_EDGE, mouseY, button);

        if (button == 0 && this.mouseOverLogo && !this.currentPanel.stealFocus())
        {
            this.showAboutPanel();
        }

        if (!this.currentPanel.stealFocus())
        {
            super.func_73864_a(mouseX, mouseY, button);
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#mouseReleased(int, int, int)
     */
    @Override
    protected void func_146286_b(int mouseX, int mouseY, int button)
    {
        if (button == -1)
        {
            this.currentPanel.mouseMoved(mouseX - LEFT_EDGE, mouseY);
        }
        else
        {
            this.currentPanel.mouseReleased(mouseX - LEFT_EDGE, mouseY, button);
        }

        if (!this.currentPanel.stealFocus())
        {
            super.func_146286_b(mouseX, mouseY, button);
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.gui.GuiScreen#handleMouseInput()
     */
    @Override
    public void func_146274_d() throws IOException
    {
        int mouseWheelDelta = Mouse.getEventDWheel();
        if (mouseWheelDelta != 0)
        {
            this.currentPanel.mouseWheelScrolled(mouseWheelDelta);
        }

        super.func_146274_d();
    }

    /**
     * @param mouseX
     * @param active
     * @param mouseOverTab
     */
    public void handleMouseClick(int mouseX, int mouseY, float partialTicks, boolean active, boolean mouseOverTab)
    {
        boolean mouseDown = Mouse.isButtonDown(0);
        if (((active && mouseX < LEFT_EDGE && this.tweenAmount > 0.75) || mouseOverTab) && !this.mouseDown && mouseDown)
        {
            this.mouseDown = true;
            this.toggled = true;
        }
        else if (this.mouseDown && !mouseDown)
        {
            this.mouseDown = false;
        }
    }

    /**
     * @param partialTicks
     * @param active
     */
    private float calcTween(float partialTicks, boolean active)
    {
        double tickValue = this.tickNumber + partialTicks;

        if (active && this.tweenAmount < 1.0)
        {
            this.tweenAmount = Math.min(1.0, this.tweenAmount + ((tickValue - this.lastTick) * TWEEN_RATE));
        }
        else if (!active && this.isOpen())
        {
            this.tweenAmount = Math.max(0.0, this.tweenAmount - ((tickValue - this.lastTick) * TWEEN_RATE));
        }

        this.lastTick = tickValue;
        return 1.0F - (float)Math.sin(this.tweenAmount * 0.5 * Math.PI);
    }

    /**
     * Called when the tab is clicked
     */
    void onToggled()
    {
        this.toggled = false;
        this.field_146297_k.func_147108_a(this.field_146297_k.field_71462_r == this ? this.parentScreen : this);
    }

    /**
     * Callback for the "config" button, display the config panel for the
     * currently selected mod.
     */
    void openConfigPanel(ConfigPanel panel, LiteMod mod)
    {
        if (panel != null)
        {
            this.setCurrentPanel(new GuiPanelConfigContainer(this.field_146297_k, panel, mod));
        }
    }

    /**
     * @param newPanel
     */
    private void setCurrentPanel(GuiPanel newPanel)
    {
        this.closeCurrentPanel();

        this.currentPanel = newPanel;
        this.currentPanel.setSize(this.field_146294_l - LEFT_EDGE, this.field_146295_m);
        this.currentPanel.onShown();
    }

    /* (non-Javadoc)
     * @see com.mumfrey.liteloader.modconfig.ConfigPanelHost#close()
     */
    private void closeCurrentPanel()
    {
        this.currentPanel.onHidden();
        this.currentPanel = this.modsPanel;
        this.modsPanel.setSize(this.field_146294_l - LEFT_EDGE, this.field_146295_m);
    }

    /**
     * Draw a tooltip at the specified location and clip to screenWidth and
     * screenHeight
     * 
     * @param fontRenderer
     * @param tooltipText
     * @param left
     * @param top
     * @param screenWidth
     * @param screenHeight
     * @param colour
     * @param backgroundColour
     */
    public static void drawTooltip(FontRenderer fontRenderer, String text, int left, int top, int screenWidth, int screenHeight,
            int colour, int backgroundColour)
    {
        String[] lines = text.trim().split("\\r?\\n");
        int textWidth = 0;
        int textHeight = 9 * lines.length;
        for (String line : lines)
        {
            textWidth = Math.max(textWidth, fontRenderer.func_78256_a(line));
            top -= 9;
        }
        
        left = Math.max(0, Math.min(screenWidth - 4, left - 4));
        top = Math.max(0, Math.min(screenHeight - 16, top + 9));
        func_73734_a(left - textWidth - 2, top, left + 2, top + textHeight + 2, backgroundColour);
        for (String line : lines)
        {
            fontRenderer.func_175063_a(line, left - textWidth, (top += 9) - 7, colour);
        }
    }


    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @param u
     * @param v
     * @param u2
     * @param v2
     * @param alpha
     */
    static void glDrawTexturedRect(int x, int y, int width, int height, int u, int v, int u2, int v2, float alpha)
    {
        float texMapScale = 0.00390625F; // 256px
        glDrawTexturedRect(x, y, width, height, u * texMapScale, v * texMapScale, u2 * texMapScale, v2 * texMapScale, alpha);
    }

    /**
     * @param x
     * @param y
     * @param width
     * @param height
     * @param u
     * @param v
     * @param u2
     * @param v2
     * @param alpha
     */
    static void glDrawTexturedRect(int x, int y, int width, int height, float u, float v, float u2, float v2, float alpha)
    {
        glDisableLighting();
        glEnableBlend();
        glAlphaFunc(GL_GREATER, 0.0F);
        glEnableTexture2D();
        glColor4f(1.0F, 1.0F, 1.0F, alpha);

        Tessellator tessellator = Tessellator.func_178181_a();
        BufferBuilder buf = tessellator.func_178180_c();
        buf.func_181668_a(GL_QUADS, VF_POSITION_TEX);
        buf.func_181662_b(x + 0,     y + height, 0).func_187315_a(u , v2).func_181675_d();
        buf.func_181662_b(x + width, y + height, 0).func_187315_a(u2, v2).func_181675_d();
        buf.func_181662_b(x + width, y + 0,      0).func_187315_a(u2, v ).func_181675_d();
        buf.func_181662_b(x + 0,     y + 0,      0).func_187315_a(u , v ).func_181675_d();
        tessellator.func_78381_a();

        glDisableBlend();
        glAlphaFunc(GL_GREATER, 0.01F);
    }

    /**
     * @param x
     * @param y
     * @param icon
     * @param alpha
     */
    static void glDrawTexturedRect(int x, int y, Icon icon, float alpha)
    {
        glDrawTexturedRect(x, y, icon.getIconWidth(), icon.getIconHeight(), icon.getMinU(), icon.getMinV(), icon.getMaxU(), icon.getMaxV(), alpha);
    }
}
