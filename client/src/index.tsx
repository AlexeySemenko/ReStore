import ReactDOM from 'react-dom/client'
import '/src/app/layouts/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/router.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore.ts';
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);


root.render(
  // <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
//  </React.StrictMode>,
)
