/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.util.debug;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableList.Builder;

/**
 * A debug screen message, only displayed on clients. Consumers can create 
 * debug messages and then change them using the returned handle.
 */
public final class DebugMessage
{
    /**
     * Position to display the debug message, relative to other debug info
     */
    public enum Position
    {
        /**
         * At the top of the left column, immediately below the version string
         */
        LEFT_TOP,
        
        /**
         * At the bottom of the left column, after the debug info and before
         * the help text 
         */
        LEFT_AFTER_INFO,
        
        /**
         * At the bottom of the left column, below the help text and prompt 
         */
        LEFT_BOTTOM,
        
        /**
         * At the top of the right column, above the JVM details 
         */
        RIGHT_TOP,
        
        /**
         * At the bottom of the right column 
         */
        RIGHT_BOTTOM;
    }
    
    /**
     * Map of positions to lists of messages
     */
    private static final Map<Position, List<DebugMessage>> messages = new EnumMap<DebugMessage.Position, List<DebugMessage>>(Position.class);
    
    /**
     * Position for this message 
     */
    private final Position position;
    
    /**
     * Message text, can be null though it is recommended to set the message to
     * invisible to hide it. Null messages leave a blank line.
     */
    private String message;
    
    /**
     * Current visible state
     */
    private boolean visible = true;

    private DebugMessage(Position position, String message)
    {
        this.position = position;
        this.message = message;
    }
    
    /**
     * Update the message text. Null messages can be used to leave blank lines
     * 
     * @param message the new message text
     * @return fluent interface
     */
    public DebugMessage setMessage(String message)
    {
        this.message = message;
        return this;
    }
    
    /**
     * Set the message visibility.
     * 
     * @param visible visibility state
     * @return fluent interface
     */
    public DebugMessage setVisible(boolean visible)
    {
        this.visible = visible;
        return this;
    }
    
    public boolean isVisible()
    {
        return this.visible;
    }
    
    @Override
    public String toString()
    {
        return this.message != null ? this.message : "";
    }
    
    /**
     * Remove the message permanently, to re-add the message you must create a
     * new one. After calling this method, the {@link #setMessage} and
     * {@link #setVisible} methods have no effect.
     */
    public void remove()
    {
        List<DebugMessage> messages = DebugMessage.messages.get(this.position);
        if (messages != null)
        {
            messages.remove(this);
            if (messages.size() == 0)
            {
                DebugMessage.messages.put(this.position, null);
            }
        }
    }
    
    /**
     * Create a new debug message with the specified initital values
     * 
     * @param position Position to display the message
     * @param message Initial message (can be changed with {@link #setMessage}
     * @return new message handle
     */
    public static DebugMessage create(Position position, String message)
    {
        if (position == null)
        {
            throw new NullPointerException("Null position specified");
        }
        
        DebugMessage debugMessage = new DebugMessage(position, message);
        if (DebugMessage.messages.get(position) == null)
        {
            DebugMessage.messages.put(position, new ArrayList<DebugMessage>()); 
        }
        
        DebugMessage.messages.get(position).add(debugMessage);
        return debugMessage;
    }
    
    public static List<String> getMessages(Position position)
    {
        List<DebugMessage> debugMessages = DebugMessage.messages.get(position);
        if (debugMessages == null)
        {
            return null;
        }
        
        Builder<String> messages = ImmutableList.<String>builder();
        for (DebugMessage debugMessage : debugMessages)
        {
            if (debugMessage.isVisible())
            {
                messages.add(debugMessage.toString());
            }
        }
        return messages.build();
    }
}
