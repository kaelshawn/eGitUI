import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite-no-reset.min.css'
import './assets/main.css'

import App from './App'
import { CustomProvider } from 'rsuite'

createRoot(document.getElementById('root')!).render(
  <CustomProvider theme="dark">
    <App />
  </CustomProvider>
)
