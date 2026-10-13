package com.mumfrey.webprefs.framework;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.mumfrey.webprefs.exceptions.InvalidRequestException;
import com.mumfrey.webprefs.exceptions.InvalidResponseException;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceDelegate;

class WebPreferencesRequestSet extends WebPreferencesRequestAbstract
{
    private static final long serialVersionUID = 1L;

    @Expose @SerializedName("set")
    private final Map<String, String> map = new HashMap<String, String>();
    
    @Expose @SerializedName("private")
    private boolean isPrivate;

    public WebPreferencesRequestSet(IWebPreferencesServiceDelegate delegate, String uuid, Map<String, String> values)
    {
        this(delegate, uuid, values, false);
    }

    public WebPreferencesRequestSet(IWebPreferencesServiceDelegate delegate, String uuid, Map<String, String> values, boolean isPrivate)
    {
        super(delegate, uuid);
        
        if (isPrivate && delegate.getSession() == null)
        {
            throw new InvalidRequestException(RequestFailureReason.NO_SESSION, "Cannot request private values without supplying a session");
        }

        this.validate(values);
        
        this.map.putAll(values);
        this.isPrivate = isPrivate;
    }

    @Override
    protected String getPath()
    {
        return "/set";
    }

    @Override
    public boolean isValidationRequired()
    {
        return true;
    }

    @Override
    public Set<String> getKeys()
    {
        return this.map.keySet();
    }

    public Map<String, String> getMap()
    {
        return this.map;
    }

    @Override
    protected void validateResponse(IWebPreferencesResponse response)
    {
        if (response.hasSetters())
        {
            Set<String> responseKeys = response.getSetters();
            for (String key : this.map.keySet())
            {
                if (!responseKeys.contains(key))
                {
                    throw new InvalidResponseException(RequestFailureReason.BAD_DATA,
                            "The server responded with an incomplete key set, missing key [" + key + "]");
                }
            }
        }
    }
    
    private void validate(Map<String, String> set)
    {
        for (Entry<String, String> entry : set.entrySet())
        {
            this.validateKey(entry.getKey());
            this.validateValue(entry.getKey(), entry.getValue());
        }
    }
}
