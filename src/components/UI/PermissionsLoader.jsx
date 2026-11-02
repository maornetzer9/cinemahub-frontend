import { useEffect, useState, useCallback, memo } from 'react';
import { usePermissions } from '../../hooks/permissions';
import { buttonsPermissionsAction } from '../../actions/buttons';
import { useDispatch } from 'react-redux';
import Loader from './Loader';
import { readStoredUsername } from '../../utils/sessionLogout';

const PermissionsLoader = ({ children }) => {
    const dispatch = useDispatch();
    const { getUserButtonsPermissions } = usePermissions();
    const [loading, setLoading] = useState(true);

    // Memoized fetchPermissions function
    const fetchPermissions = useCallback(async () => {
        const username = readStoredUsername(); 
        if (username) 
        {
            try 
            {
                await dispatch(buttonsPermissionsAction(getUserButtonsPermissions, username));
            } 
            catch(error) 
            {
                console.error('Failed to fetch permissions:', error.message);
            } 
            finally 
            {
                setLoading(false);
            }
        }
        else
        {
            setLoading(false);
        }
    }, [dispatch, getUserButtonsPermissions]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    if (loading) return <Loader color={'success'} />;

    return <>{children}</>;
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PermissionsLoader);
