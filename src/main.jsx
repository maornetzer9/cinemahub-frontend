import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary.jsx'
import { store } from './reducers/store.js'
import cinemaTheme from './theme/index.js'
import './utils/setupAxios.js'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={cinemaTheme}>
                    <CssBaseline />
                    <AppErrorBoundary>
                        <App />
                    </AppErrorBoundary>
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
)
