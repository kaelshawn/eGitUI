import { createRoot } from 'react-dom/client'
import 'rsuite/dist/rsuite-no-reset.min.css'
import './assets/main.css'

import Repo from './Repo'
import { CustomProvider } from 'rsuite'

createRoot(document.getElementById('root')!).render(
  <CustomProvider theme="dark">
    <Repo />
  </CustomProvider>
)
