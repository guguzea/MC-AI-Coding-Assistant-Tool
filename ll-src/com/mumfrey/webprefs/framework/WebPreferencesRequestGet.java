package com.mumfrey.webprefs.framework;

import java.util.HashSet;
import java.util.Set;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.mumfrey.webprefs.exceptions.InvalidRequestException;
import com.mumfrey.webprefs.exceptions.InvalidResponseException;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceDelegate;

class WebPreferencesRequestGet extends WebPreferencesRequestAbstract
{
    private static final long serialVersionUID = 1L;

    @Expose @SerializedName("get")
    private final Set<String> keys = new HashSet<String>();
    
    @Expose @SerializedName("private")
    private boolean isPrivate;

    public WebPreferencesRequestGet(IWebPreferencesServiceDelegate delegate, String uuid, Set<String> keys)
    {
        this(delegate, uuid, keys, false);
    }

    public WebPreferencesRequestGet(IWebPreferencesServiceDelegate delegate, String uuid, Set<String> keys, boolean isPrivate)
    {
        super(delegate, uuid);

        if (isPrivate && delegate.getSession() == null)
        {
            throw new InvalidRequestException(RequestFailureReason.NO_SESSION, "Cannot request private values without supplying a session");
        }

        this.validate(keys);

        this.keys.addAll(keys);
        this.isPrivate = isPrivate;
    }

    @Override
    protected String getPath()
    {
        return "/get";
    }

    @Override
    public boolean isValidationRequired()
    {
        return this.isPrivate;
    }

    @Override
    public Set<String> getKeys()
    {
        return this.keys;
    }

    @Override
    protected void validateResponse(IWebPreferencesResponse response)
    {
        if (response.hasValues())
        {
            Set<String> responseKeys = response.getValues().keySet();
            for (String key : this.keys)
            {
                if (!responseKeys.contains(key))
                {
                    throw new InvalidResponseException(RequestFailureReason.BAD_DATA,
                            "The server responded with an incomplete key set, missing key [" + key + "]");
                }
            }
        }
    }
    
    private void validate(Set<String> keys)
    {
        if (keys == null || keys.isEmpty())
        {
            throw new InvalidRequestException(RequestFailureReason.BAD_PARAMS, "Cannot request an empty set");
        }

        for (String key : keys)
        {
            this.validateKey(key);
        }
    }
}
