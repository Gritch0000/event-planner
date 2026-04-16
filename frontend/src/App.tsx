import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

//СПИСОК ПОДІЙ
const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    //Запитуємо дані з Бекенду
    axios.get('http://localhost:3000/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error("Помилка завантаження:", err));
  }, []);

  return (
    <div>
      <h2>Всі події</h2>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        {events.length === 0 ? <p>Подій поки немає...</p> : events.map((event: any) => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', minWidth: '200px', background: '#fff' }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p><strong>Де:</strong> {event.location}</p>
            <small><strong>Коли:</strong> {event.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

//СТОРІНКА СТВОРЕННЯ 
const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = { title, description, date, location };

    try {
      await axios.post('http://localhost:3000/events', newEvent);
      alert('Подію успішно створено!');
      
      setTitle(''); setDescription(''); setDate(''); setLocation('');
    } catch (error: any) {
      alert('Помилка: ' + (error.response?.data?.message || 'Щось пішло не так'));
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Додати нову подію</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input placeholder="Назва" value={title} onChange={e => setTitle(e.target.value)} style={{padding: '8px'}} />
        <textarea placeholder="Опис" value={description} onChange={e => setDescription(e.target.value)} style={{padding: '8px'}} />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{padding: '8px'}} />
        <input placeholder="Місце" value={location} onChange={e => setLocation(e.target.value)} style={{padding: '8px'}} />
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Зберегти подію
        </button>
      </form>
    </div>
  );
};

//ПРО ПРОЄКТ
const About = () => (
  <div>
    <h2>Про проєкт</h2>
    <p>Це навчальний проєкт "Event Planner", створений на 3 курсі практики.</p>
    <p>Використані технології: Nest.js + React + TypeScript.</p>
  </div>
);

//(НАВІГАЦІЯ)
function App() {
  return (
    <Router>
      <header style={{ background: '#222', color: '#fff', padding: '1rem' }}>
        <nav>
          <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Головна</Link>
          <Link to="/create" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none' }}>Створити подію</Link>
          <Link to="/about" style={{ color: '#fff', textDecoration: 'none' }}>Про проєкт</Link>
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateEvent />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;