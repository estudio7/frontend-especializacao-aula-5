import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, editTodo, deleteTodo, setTodos } from './redux/todoReducer';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './TodoList.css';

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo);

  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDate, setNewDate] = useState(''); //Adicionado

  const handleAdd = async () => {
    const newTodo = { title: newTitle, description: newDescription, category: newCategory, date: newDate };
    const response = await axios.post('https://api-todo-six.vercel.app/todo', newTodo);
    dispatch(addTodo(response.data));
    setNewTitle('');
    setNewDescription('');
    setNewCategory('');
    setNewDate(''); //Adicionado
  };

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setNewTitle(todo.title);
    setNewDescription(todo.description);
    setNewCategory(todo.category);
    setNewDate(todo.date); 
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://api-todo-six.vercel.app/todo/${id}`);
    dispatch(deleteTodo(id));
  };

  const handleSave = async () => {
    const updatedTodo = { ...currentTodo, title: newTitle, description: newDescription, category: newCategory, date: newDate }; //Adicionado 'date'
    await axios.put(`https://api-todo-six.vercel.app/todo/${updatedTodo._id}`, updatedTodo);
    dispatch(editTodo(updatedTodo));
    setShowModal(false);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get('https://api-todo-six.vercel.app/todo');
      dispatch(setTodos(response.data));
    };

    fetchTodos();
  }, [dispatch]);

  return (
    <div className="container">
      <Row>
        <Col sm={12} md={3}>
          <Form className='mt-5 box-new'>
            <h4 className="mt-4">Cadastrar Tarefa</h4>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Data</Form.Label>
              <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </Form.Group>
            <Button className="mt-2 btn-orange" onClick={handleAdd}>
              Adicionar Tarefa
            </Button>
          </Form>
        </Col>
        <Col sm={12} md={9}>
          <div className="list-group">
            <h2 className="mt-4 text-white">Lista de Tarefas</h2>
            {todos.map((todo) => (
              <div key={todo._id} className="mb-3 box-list list-group-item">
                <Row>
                  <Col sm={12} md={8} className="d-flex flex-column justify-content-between">
                    <div>
                      <h3>{todo.title}</h3>
                      <p className='fw-bold'>{todo.category}</p>
                      <p> {todo.description}</p>
                    </div>
                  </Col>
                  <Col sm={12} md={4} className="d-flex flex-column justify-content-between align-items-end">
                    <div>
                      <p className='fw-bold'>{new Date(todo.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faEdit} className="mr-2 text-success" onClick={() => handleEdit(todo)} />
                      <FontAwesomeIcon icon={faTrashAlt} className="icon-spacing text-danger" onClick={() => handleDelete(todo._id)} />
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Tarefa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Descrição</Form.Label>
              <Form.Control type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Categoria</Form.Label>
              <Form.Control type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fechar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TodoList;
