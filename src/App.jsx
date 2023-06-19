import 'bootstrap/dist/css/bootstrap.min.css';
import TodoList from './TodoList';
import { Provider } from 'react-redux';
import store from './redux/store'; 

const App = () => {
  return (
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
};

export default App;
