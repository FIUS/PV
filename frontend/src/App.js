import Header from './Header'
import { useState, useEffect } from 'react'
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
  const [secret, setsecret] = useState("")

  const baseUrl = "https://api.pv.fg-inf.de"

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const logoutCallback = () => {
    const fetch = async () => {
      const resp = await fetchAPI_POST("logout")
      if (resp.code === 200) {
        setloginToken("");
        console.log("Logged out")
      }else{
        openSnackbar("Logout unsuccessfull", "error")
      }
    }
    fetch()
    
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

  useEffect(() => {
    const fetch = async () => {
      const resp = await fetchAPI_GET("authenticated")
      if (resp.code === 200) {
        console.log("Restored session")
        setloginToken("Old session")
      }
    }
    fetch()

  }, []);

  const fetchAPI_GET = async (url) => {
    const userInput = await fetch(baseUrl + "/" + url,
      {
        credentials: 'include',
        method: "GET",
        headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": baseUrl + "/*" },
      });

    const status_code = userInput.status

    if (status_code === 200) {
      const userJson = await userInput.json();

      return { code: status_code, content: userJson }
    } else if (status_code === 403) {
      if (loginToken !== "") {
        openSnackbar("Token invalid", "error")
        setloginToken("")
      }
      return { code: status_code }
    } else {
      return { code: status_code }
    }
  }

  const fetchAPI_POST = async (url, body) => {

    const resp = await fetch(baseUrl + "/" + url,
      {
        credentials: 'include',
        method: "POST",
        headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": baseUrl + "/*" },
        body: JSON.stringify(body)
      });
    const status_code = resp.status
    if (status_code === 200) {
      const userJson = await resp.json();

      return { code: status_code, content: userJson }
    } else if (status_code === 403) {
      openSnackbar("Token invalid", "error")
      setloginToken("")
      return { code: status_code }
    } else {
      return { code: status_code }
    }
  }

  const getQrCode = async () => {
    const resp = await fetchAPI_POST("create/qr", cart.map(item => item[0]))
    if (resp.code === 200) {
      setsecret(resp.content.secret)
      setqrUrl(resp.content.url)
    } else {
      openSnackbar("Something went wrong while creating the qr-code", "error")
      setincheckout(false)
    }
  }

  const centerClassName = cart.length > 0 ? "centerFlex" : "flexMiddle"

  return (
    <div>
      <Header onLogOut={logoutCallback} token={loginToken} api_post={fetchAPI_POST} snackbar={openSnackbar} fetchAPI_GET={fetchAPI_GET}/>
      {loginToken === "" ?
        <Login baseUrl={baseUrl} snackbar={openSnackbar} onLogIn={setloginToken} />
        : (
          !incheckout ? (
            <div className={centerClassName}>
              <ExamList snackbar={openSnackbar} api_fetch={fetchAPI_GET} cart={cart} setcart={setcart} />
              {cart.length > 0 ?
                <CartList cart={cart} setcart={setcart} setincheckout={setincheckout} generateQr={getQrCode} /> : ""
              }
            </div>
          ) : <Checkout secret={secret} setInCheckout={setincheckout} qrUrl={qrUrl} setqrUrl={setqrUrl} setCart={setcart} fetchAPI_GET={fetchAPI_GET}/>

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
