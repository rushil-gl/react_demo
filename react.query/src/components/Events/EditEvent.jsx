import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingIndicator from '../UI/LoadingIndicator';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEvent, queryClient, updateEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading, isError, error} = useQuery({
    queryKey: ['event-detail', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;
      console.log('I am here', newEvent);

      await queryClient.cancelQueries({ queryKey: ['event-detail', id] });
      queryClient.setQueryData(['event-detail', id], newEvent);
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isLoading) {
    content = <div className="center"><LoadingIndicator /></div>;
  }

  if (isError) {
    content = (
      <>
        <ErrorBlock title="Failed to load event" message={error.info?.message || "Something went wrong!"} />
        <Link to="../" className="button">Okay</Link>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    )
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
