import Header from './Header'
import { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Login from './Login'
import ExamList from './ExamList';
import CartList from './CartList';
import Checkout from './Checkout';

function App() {
  const [loginToken, setloginToken] = useState("");
  const [snackbarState, setSnackbarState] = useState("");
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cart, setcart] = useState([])
  const [incheckout, setincheckout] = useState(false)
  const [qrUrl, setqrUrl] = useState("")

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const logoutCallback = () => {
    setloginToken("");
    console.log("Logged out")
  };
  const openSnackbar = (text, state) => {
    setSnackbarState(state);
    setSnackbarText(text);
    setSnackbarOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false)
  };


  const fetchAPI_GET = async (url) => {
    const userInput = await fetch(url,
      {
        credentials: 'same-origin',
        method: "GET",
        headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "fius-hawkeye:5000/*" },
      });

    const status_code = userInput.status

    if (status_code === 200) {
      const userJson = await userInput.json();

      return { code: status_code, content: userJson }
    } else {
      return { code: status_code }
    }
  }

  const fetchAPI_POST = async (url, body) => {
    const resp = await fetch(url,
      {
        credentials: 'same-origin',
        method: "POST",
        headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "fius-hawkeye:5000/*" },
        body: JSON.stringify(body)
      });
    const status_code = resp.status
    if (status_code === 200) {
      const userJson = await resp.json();

      return { code: status_code, content: userJson }
    } else {
      return { code: status_code }
    }
  }

  const getQrCode = async () => {
    const resp = await fetchAPI_POST("http://fius-hawkeye:5000/create/qr", null)
    if (resp.code === 200) {
      setqrUrl(resp.content.url)
    } else {
      snackbarOpen("Something went wrong while creating the qr-code", "error")
      setincheckout(false)
    }
  }

  return (
    <div>
      <Header onLogOut={logoutCallback} token={loginToken} api_post={fetchAPI_POST} snackbar={openSnackbar} />
      {loginToken === "" ?
        <Login snackbar={openSnackbar} onLogIn={setloginToken} />
        : (
          !incheckout ? (
            <div>
              {cart.length > 0 ?
                <CartList cart={cart} setcart={setcart} setincheckout={setincheckout} generateQr={getQrCode}/> : ""
              }
              <ExamList snackbar={openSnackbar} api_fetch={fetchAPI_GET} cart={cart} setcart={setcart} />
            </div>
          ) : <Checkout setInCheckout={setincheckout} qrUrl={qrUrl} setqrUrl={setqrUrl} />

        )
      }

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarState}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
