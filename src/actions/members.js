import { deleteMemberRoute, editMemberRoute, membersRoute, newMemberRoute, newSubscriptionRoute } from "../routes/members";

export const MEMBERS_LOADING = 'MEMBERS_LOADING';
export const MEMBERS_LOADING_SUCCESS = 'MEMBERS_LOADING_SUCCESS';
export const MEMBERS_LOADING_FAILURE = 'MEMBERS_LOADING_FAILURE';

export const NEW_MEMBER_SUCCESS = 'NEW_MEMBER_SUCCESS';
export const NEW_MEMBER_LOADING = 'NEW_MEMBER_LOADING';
export const NEW_MEMBER_FAILURE = 'NEW_MEMBER_FAILURE';

export const DELETE_MEMBER_LOADING = 'DELETE_MEMBER_LOADING';
export const DELETE_MEMBER_SUCCESS = 'DELETE_MEMBER_SUCCESS';
export const DELETE_MEMBER_FAILURE = 'DELETE_MEMBER_FAILURE';

export const EDIT_MEMBER_LOADING = 'EDIT_MEMBER_LOADING';
export const EDIT_MEMBER_SUCCESS = 'EDIT_MEMBER_SUCCESS';
export const EDIT_MEMBER_FAILURE = 'EDIT_MEMBER_FAILURE';

export const NEW_SUBSCRIPTION_LOADING = 'NEW_SUBSCRIPTION_LOADING';
export const NEW_SUBSCRIPTION_SUCCESS = 'NEW_SUBSCRIPTION_SUCCESS';
export const NEW_SUBSCRIPTION_FAILURE = 'NEW_SUBSCRIPTION_FAILURE';


export const loadingMembersAction = (url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: MEMBERS_LOADING });
        const { code, message, members } = await membersRoute(url);
        
        if(code !== 200)
        {
            dispatch({type: MEMBERS_LOADING_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: MEMBERS_LOADING_SUCCESS, payload: members});
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: MEMBERS_LOADING_FAILURE, payload: err.message});
    }
};


export const newMemberAction = (newMember, url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: NEW_MEMBER_LOADING });
        const { code, message, member } = await newMemberRoute(newMember, url);

        if(code !== 200)
        {
            dispatch({type: NEW_MEMBER_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: NEW_MEMBER_SUCCESS, payload: member})
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: NEW_MEMBER_FAILURE, payload: err.message});
    }
};


export const newSubscriptionAction = (newSubscription, url) => async (dispatch) => {
    try
    {
        dispatch({ type: NEW_SUBSCRIPTION_LOADING });
        const { code, message, member } = await newSubscriptionRoute(newSubscription, url);

        if(code !== 200)
        {
            dispatch({type: NEW_SUBSCRIPTION_FAILURE, payload: message});
            return { code, message };
        }
    
            dispatch({type: NEW_SUBSCRIPTION_SUCCESS, payload: member})
            return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: NEW_SUBSCRIPTION_FAILURE, payload: err.message})
        
    }
};


export const deleteMemberAction = (id, url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: DELETE_MEMBER_LOADING });
        const { code, message, members } = await deleteMemberRoute(id, url);

        if(code !== 200)
        {
            dispatch({type: DELETE_MEMBER_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: DELETE_MEMBER_SUCCESS, payload: members })
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: DELETE_MEMBER_FAILURE, payload: err.message});
    }
};


export const editMemberAction = (form, url) => async ( dispatch ) => {
    try
    {
        dispatch({ type: EDIT_MEMBER_LOADING });
        const { code, message, member } = await editMemberRoute(form, url);


        if(code !== 200)
        {
            dispatch({type: EDIT_MEMBER_FAILURE, payload: message});
            return { code, message };
        } 
        dispatch({type: EDIT_MEMBER_SUCCESS, payload: member })
        return { code, message };
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({type: EDIT_MEMBER_FAILURE, payload: err.message});
    }
};