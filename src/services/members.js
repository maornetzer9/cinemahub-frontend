import { deleteMemberAction, editMemberAction, loadingMembersAction, newMemberAction, newSubscriptionAction } from "../actions/members";
import { SUBSCRIPTIONS } from "../config/serviceUrls";
import { hasAuthToken } from "../utils/sessionLogout";

export const loadingMembers = async (dispatch) => {
    if (!hasAuthToken()) return;
    try
    {
        const MEMBERS = `${SUBSCRIPTIONS}/members/`;
        await dispatch(loadingMembersAction(MEMBERS));
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const addNewMemberService = async (newMember, dispatch) => {

    try
    {
        const MEMBERS = `${SUBSCRIPTIONS}/members/add`;
        const { code, message } = await dispatch(newMemberAction(newMember, MEMBERS));
        return { code, message }
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const editMemberService = async (form, dispatch) => {
    try
    {
        const EDIT_MEMBER = `${SUBSCRIPTIONS}/members/edit`;
        const { code } = await dispatch(editMemberAction(form, EDIT_MEMBER));
        return { code };
    }
    catch(err)
    {
        console.error(err.message);
        throw new Error(err.message);
    }
};


export const newSubscriptionService = async (newSubscription, dispatch) => {
    try
    {       
        const NEW_SUBSCRIPTION = `${SUBSCRIPTIONS}/members/new-subscription`;
        const result = await dispatch(newSubscriptionAction(newSubscription, NEW_SUBSCRIPTION));
        if (!result || result.code !== 200) {
            throw new Error(result?.message || 'Failed to create subscription');
        }
        return result;
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
};

export const deleteMemberById = async (id, dispatch) => {
    try
    {
        const DELETE_MEMBER = `${SUBSCRIPTIONS}/members/delete`;
        const result = await dispatch(deleteMemberAction(id, DELETE_MEMBER));
        if (!result || result.code !== 200) {
            throw new Error(result?.message || 'Failed to delete member');
        }
        return result;
    }
    catch(err)
    {
        console.error(err.message);
        throw err;
    }
};