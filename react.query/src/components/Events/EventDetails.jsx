import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const { mutate, isLoading: isLoadingDeletion, isError: isErrorDeletion, error: errorDeletion } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'], refetchType: 'none' });
      navigate('/events');
    }
  });

  const handleStartDelete = () => {
    setIsDeleting(true);
  }

  const handleStopDelete = () => {
    setIsDeleting(false);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['event-detail', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id })
  });

  const deleteHandler = () => {
    mutate({ id });
  }

  let content;

  if (isLoading) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  if (isError) {
    content = (
      <ErrorBlock title="Failed to fetch event" message={error.info?.message || "Something went wrong"} />
    );
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="No Image Found" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && <Modal onClose={handleStopDelete}>
        <h2>Are you sure?</h2>
        <p>Do you really wnat to delete this event?</p>
        <div className="form-actions">
          {isLoadingDeletion && <p>Deleting...</p>}
          {!isLoadingDeletion && <><button onClick={handleStopDelete} className="button-text">Cancel</button>
          <button onClick={deleteHandler} className="button">Delete</button></>} 
        </div>
        {isErrorDeletion && <ErrorBlock title="Failed to delete the event" message={errorDeletion.info?.message || "Something went wrong"} />}
      </Modal>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
