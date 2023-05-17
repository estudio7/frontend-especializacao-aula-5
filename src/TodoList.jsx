import { useState } from 'react';
import { useQuery,useQueryClient,  useMutation } from 'react-query';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './TodoList.css';

const fetchTodo = async () => {
  const response = await axios.get('https://api-todo-six.vercel.app/todo');
  return response.data;
};

const editTodo = async (todo) => {
  const response = await axios.put(`https://api-todo-six.vercel.app/todo/${todo._id}`, todo);
  return response.data;
};

const deleteTodo = async (id) => {
  const response = await axios.delete(`https://api-todo-six.vercel.app/todo/${id}`);
  return response.data;
};

const TodoList = () => {
  const queryClient = useQueryClient(); // Adicione esta linha
  const { data: todo, status } = useQuery('todo', fetchTodo);
  const mutationEdit = useMutation(editTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todo');
    },
  });
  const mutationDelete = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todo');
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  const handleEdit = (todo) => {
    setCurrentTodo(todo);
    setNewTitle(todo.title);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    mutationDelete.mutate(id);
  };

  const handleSave = () => {
    const updatedTodo = { ...currentTodo, title: newTitle };
    mutationEdit.mutate(updatedTodo);
    setShowModal(false);
  };

  if (status === 'loading') {
    return <div className="alert alert-primary">Carregando...</div>;
  }

  if (status === 'error') {
    return <div className="alert alert-danger">Erro ao carregar os dados.</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-4">Lista de Tarefas</h1>
      <div className="list-group">
        {todo.map((todo) => (
          <div key={todo._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h3>{todo.title}</h3>
              <p>Id: {todo._id}</p>
              <p>Data: {new Date(todo.date).toLocaleDateString()}</p>
            </div>
            <div>
              <FontAwesomeIcon icon={faEdit} className="mr-2" onClick={() => handleEdit(todo)} />
              <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDelete(todo._id)} />
            </div>
          </div>
        ))}
      </div>

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