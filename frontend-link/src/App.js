
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import { useState, useEffect } from 'react';

function App() {

  const [links, setlinks] = useState([])

  const fetchAPI = async (url) => {
    const resp = await fetch(url,
      {
        credentials: 'same-origin',
        method: "GET",
        headers: { "Content-type": "application/json", "Access-Control-Allow-Origin": "fius-hawkeye:5000/*" },
      });
    const status_code = resp.status
    if (status_code === 200) {
      const userJson = await resp.json();

      return { code: status_code, content: userJson }
    } else {
      return { code: status_code }
    }
  }

  useEffect(() => {
    const load = async () => {

      const resp = await fetchAPI("http://fius-hawkeye:5000/links?code=" + window.location.pathname.substr(1))
      console.log(resp)
      if (resp.code === 200) {
        setlinks(resp.content)
      }
    }

    load()

  }, [])


  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <TableContainer style={{ marginTop: "20px", width: "70%" }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Fachname</TableCell>
              <TableCell>Nextcloud Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {links.map((item) => (
              <TableRow key={item[1]} className="examitem">
                <TableCell component="th" scope="row">{item[0]}</TableCell>
                <TableCell><a href={item[1]}>{item[1]}</a></TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </TableContainer>

    </div>
  );
}

export default App;
