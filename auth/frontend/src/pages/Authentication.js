import { json, redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { getAuthToken } from '../util/auth';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request }) {
  const {searchParams} = new URL(request.url);
  const mode = searchParams.get('mode');

  if (mode !== 'login' && mode !== 'signup') {
    throw json({ message: 'Unsupported mode' }, { status: 422 });
  }

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  }

  const response = await fetch('http://localhost:8080/' + mode, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + getAuthToken(),
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user' }, { status: 500 });
  }

  const result = await response.json();
  localStorage.setItem('token', result.token);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());

  return redirect('/');
}
