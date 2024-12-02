
import { Provider } from 'react-redux'
import './App.css'
import Signp from './component/signup/signup'
import { store } from './redux/store'

const App: React.FC = () => {

  return (
    <Provider store={store}>
      <div>
        <Signp />

      </div>

    </Provider >
  );
};

export default App
