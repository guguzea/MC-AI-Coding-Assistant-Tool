/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util;

/**
 * Interface for objects which handle JInput events
 *
 * @author Adam Mummery-Smith
 */
public interface InputHandler
{
    /**
     * Called when an analogue (axis) event is raised on the specified component
     * 
     * @param source
     * @param nanos 
     * @param value 
     */
    void onAxisEvent(InputEvent source, float value, long nanos);

    /**
     * Called when a POV (Point-Of-View) event is raised on the specified
     * component.
     * 
     * @param source
     * @param value
     * @param nanos
     */
    void onPovEvent(InputEvent source, float value, long nanos);

    /**
     * Called when a button event is raised on the specified component
     * 
     * @param source
     * @param value
     */
    void onButtonEvent(InputEvent source, boolean value);
}
