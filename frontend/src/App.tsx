import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; 

//ГОЛОВНА СТОРІНКА
const Home = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [joinEventId, setJoinEventId] = useState<number | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    setIsLoading(true);
    axios.get('http://localhost:3000/events')
      .then(res => {
        
        const savedParticipants = JSON.parse(localStorage.getItem('appParticipants') || '{}');
        
        const eventsWithParticipants = res.data.map((ev: any) => ({ 
          ...ev, 
          participants: savedParticipants[ev.id] || [] 
        }));
        
        setEvents(eventsWithParticipants);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Помилка:", err);
        setIsLoading(false);
      });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю подію?')) return;
    try {
      await axios.delete(`http://localhost:3000/events/${id}`);
      setEvents(events.filter((event: any) => event.id !== id));
    } catch (error) {
      alert('Помилка видалення!');
    }
  };

  const handleEditLocation = async (id: number, oldLocation: string) => {
    const newLocation = prompt('Введіть нове місце проведення:', oldLocation);
    if (!newLocation || newLocation === oldLocation) return;

    try {
      await axios.patch(`http://localhost:3000/events/${id}`, { location: newLocation });
      fetchEvents();
    } catch (error) {
      alert('Помилка оновлення!');
    }
  };

  const openJoinModal = (eventId: number) => {
    setJoinEventId(eventId);
    setParticipantName('');
    setParticipantEmail('');
  };

  const submitParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName || !participantEmail || joinEventId === null) return;

    const newParticipant = {
      id: Date.now(),
      name: participantName,
      email: participantEmail,
      eventId: joinEventId 
    };

    setEvents((prevEvents: any) => {
      const updatedEvents = prevEvents.map((ev: any) => {
        if (ev.id === joinEventId) {
          const updatedList = [...ev.participants, newParticipant];
          
          
          const savedParticipants = JSON.parse(localStorage.getItem('appParticipants') || '{}');
          savedParticipants[joinEventId] = updatedList;
          localStorage.setItem('appParticipants', JSON.stringify(savedParticipants));

          return { ...ev, participants: updatedList };
        }
        return ev;
      });
      return updatedEvents;
    });

    setJoinEventId(null); 
  };

  const isEventSoon = (eventDateStr: string) => {
    const eventDate = new Date(eventDateStr);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3; 
  };

  return (
    <div>
      <h2>Всі події</h2>
      {isLoading ? (
        <p style={{ fontSize: '18px', color: '#555' }}>⏳ Завантаження подій...</p>
      ) : (
        <div className="events-grid">
          {events.length === 0 ? <p>Подій поки немає...</p> : events.map((event: any) => (
            <div key={event.id} className="event-card" style={{ position: 'relative' }}>
              
              {isEventSoon(event.date) && (
                <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#e74c3c', color: 'white', padding: '5px 10px', borderRadius: '20px', fontWeight: 'bold', fontSize: '12px' }}>
                  🔔 Скоро!
                </div>
              )}

              <h3>{event.title}</h3>
              <p className="description">{event.description}</p>
              
              <div className="event-details">
                <p>📍 <strong>{event.location}</strong></p>
                <p>📅 {event.date}</p>
              </div>

              <div style={{ marginBottom: '15px', padding: '10px', background: '#e8f4f8', borderRadius: '8px', fontSize: '14px' }}>
                <strong>👥 Учасники ({event.participants.length}):</strong> 
                {event.participants.length > 0 ? (
                  <ul style={{ margin: '5px 0 0 20px', padding: 0 }}>
                    {event.participants.map((p: any) => (
                      <li key={p.id}>
                        {p.name} <span style={{ color: '#7f8c8d', fontSize: '12px' }}>({p.email})</span>
                      </li>
                    ))}
                  </ul>
                ) : <span style={{ color: '#7f8c8d', marginLeft: '5px' }}>Поки нікого...</span>}
              </div>

              <div className="card-actions" style={{ marginBottom: '10px' }}>
                <button onClick={() => openJoinModal(event.id)} style={{ background: '#2ecc71', color: 'white', width: '100%' }}>🙋‍♂️ Я піду!</button>
              </div>

              <div className="card-actions">
                <button onClick={() => handleEditLocation(event.id, event.location)} className="btn-edit">Змінити місце</button>
                <button onClick={() => handleDelete(event.id)} className="btn-delete">Видалити</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {joinEventId !== null && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '10px', width: '300px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>
            <h3>Приєднатися до події</h3>
            <form onSubmit={submitParticipant} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input required placeholder="Ваше повне ім'я" value={participantName} onChange={e => setParticipantName(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <input required type="email" placeholder="Ваш Email" value={participantEmail} onChange={e => setParticipantEmail(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ background: '#3498db', color: 'white', flex: 1 }}>Зберегти</button>
                <button type="button" onClick={() => setJoinEventId(null)} style={{ background: '#95a5a6', color: 'white', flex: 1 }}>Скасувати</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
    <div style={{ maxWidth: '400px', margin: '0 auto', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
      <h2>Додати нову подію</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input required placeholder="Назва" value={title} onChange={e => setTitle(e.target.value)} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}} />
        <textarea required placeholder="Опис" value={description} onChange={e => setDescription(e.target.value)} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '80px'}} />
        <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}} />
        <input required placeholder="Місце" value={location} onChange={e => setLocation(e.target.value)} style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}} />
        <button type="submit" style={{ padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Зберегти подію
        </button>
      </form>
    </div>
  );
};

//ПРО ПРОЄКТ
const About = () => (
  <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
    <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>Про проєкт</h2>
    
    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c3e50' }}>
      Тема: Планувальник подій: Організація подій з учасниками, датами та нагадуваннями
    </p>

    <div style={{ marginTop: '20px' }}>
      <h4>👤 Розробник</h4>
      <p style={{ fontSize: '16px' }}>Студент групи [ІПЗ-23 1/9]</p>
      <p style={{ fontSize: '16px', fontWeight: 'bold' }}>[Численок Денис Юрійович]</p>
    </div>

    <div style={{ marginTop: '20px' }}>
      <h4>🛠 Стек технологій</h4>
      <ul style={{ lineHeight: '1.8' }}>
        <li><strong>Backend:</strong> Nest.js, TypeScript</li>
        <li><strong>Frontend:</strong> React, Vite, React Router</li>
        <li><strong>Інтеграція:</strong> Axios, LocalStorage</li>
        <li><strong>Стилізація:</strong> CSS</li>
      </ul>
    </div>
  </div>
);

//НАВІГАЦІЯ
function App() {
  return (
    <Router>
      <header>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link to="/">Головна</Link>
          <Link to="/create">Створити подію</Link>
          <Link to="/about">Про проєкт</Link>
        </nav>
      </header>
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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