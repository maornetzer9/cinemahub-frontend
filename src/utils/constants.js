import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';

// Permissions
export const PERMISSIONS = [
    "View-Subscriptions",
    "Update-Subscriptions",
    "Create-Subscriptions",
    "Delete-Subscriptions",
    "View-Movies",
    "Create-Movies",
    "Update-Movies",
    "Delete-Movies",
];

export const MENU = [
    { 
        id: 1,
        path: '/home', 
        label: 'Home Page', 
        icon: HomeOutlined,
    },
    { 
        id: 2,
        path: '/movies', 
        label: 'Movies', 
        icon: MovieFilterOutlinedIcon,
    },
    { 
        id: 3,
        path: '/subscriptions', 
        label: 'Subscriptions', 
        icon: SubscriptionsOutlinedIcon,
    },
    { 
        id: 4,
        path: '/users', 
        label: 'Users Management', 
        icon: ManageAccountsOutlinedIcon,
    },
    { 
        id: 5,
        path: '/', 
        label: 'Disconnect', 
        icon: ExitToAppOutlinedIcon,
    },
];
