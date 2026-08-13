import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite-no-reset.min.css'
import './assets/main.css'

import Home from './Home'
import { CustomProvider } from 'rsuite'

createRoot(document.getElementById('root')!).render(
  <CustomProvider theme="dark">
    <Home />
  </CustomProvider>
)
