export const BUTTON_PERMISSION_LOADING  = 'BUTTON_PERMISSION_LOADING';
export const BUTTON_PERMISSION_SUCCESS  = 'BUTTON_PERMISSION_SUCCESS';
export const BUTTON_PERMISSIONS_FAILURE = 'BUTTON_PERMISSIONS_FAILURE';

export const buttonsPermissionsAction = ( getUserButtonsPermissions = () => {}, username = '' ) => async (dispatch) => {
    try
    {
        dispatch({ type: BUTTON_PERMISSION_LOADING });

        const permissions = await getUserButtonsPermissions(username);

        if(!permissions)
        {
            dispatch({ type: BUTTON_PERMISSIONS_FAILURE });
            return;
        }

        dispatch({ type: BUTTON_PERMISSION_SUCCESS, payload: permissions });
    }
    catch(err)
    {
        console.error(err.message);
        dispatch({ type: BUTTON_PERMISSIONS_FAILURE });
    }
};