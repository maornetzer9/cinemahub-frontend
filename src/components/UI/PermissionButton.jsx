import { Button, Fab } from '@mui/material';
import { forwardRef, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fabSx } from '../../design-system/styles';

const PermissionButton = forwardRef(function PermissionButton(
        {
            resourceType,
            permissionType,
            type = 'button',
            color = 'primary',
            variant = 'contained',
            size = 'medium',
            sx = {},
            endIcon = null,
            startIcon = null,
            onClick = () => {},
            children,
            ...props
        },
        ref
    ) {
        const { buttonsPermissions } = useSelector((state) => state.buttonsReducer);

        const isVisible = useMemo(() => {
            if (!buttonsPermissions) return false;

            const resourcePermissions = buttonsPermissions[resourceType];

            if (!resourcePermissions) 
            {
                console.error(`Invalid resourceType: ${resourceType}`);
                return false;
            }
            return resourcePermissions[permissionType];
        }, [buttonsPermissions, resourceType, permissionType]);


        if (!isVisible) return null;

        const fabStyles = {
            ...fabSx,
            ...sx,
        };

        return type === 'fab' ? (
            <Fab
                ref={ref}
                color={color}
                size={size}
                onClick={onClick}
                sx={fabStyles}
                {...props}
            >
                {children}
            </Fab>
        ) : (
            <Button
                ref={ref}
                variant={variant}
                color={color}
                size={size}
                endIcon={endIcon}
                startIcon={startIcon}
                onClick={onClick}
                sx={sx}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

export default memo(PermissionButton);
