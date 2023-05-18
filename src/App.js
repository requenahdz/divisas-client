import React, { useEffect, useState } from 'react';
import { Typography, TextField, Stack, Pagination, Container, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { API_URL } from './config'
const App = () => {

  const [currencies, setCurrencies] = useState([]);
  const [filters, setFilters] = useState({ name: '', ask: '', bid: '' });
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const last = useSelector((state) => state.last);
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = new WebSocket(API_URL);

    socket.onopen = () => {
      socket.send('prices');
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      const arrayData = Object.entries(newData.prices).map(([name, value]) => {
        const { ask, bid } = value
        return { name, ask, bid };
      });
      dispatch({ type: 'UPDATE', payload: arrayData })
    };

    return () => {
      socket.close();
    };
  }, []);


  useEffect(() => {

    let newData = last

    if (filters.name || filters.ask || filters.bid) {
      newData = newData.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(filters.name.toLowerCase());
        const askMatch = item.ask.toString().includes(filters.ask.toString());
        const bidMatch = item.bid.toString().includes(filters.bid.toString());
        return nameMatch && askMatch && bidMatch;
      });
    }

    const elements = 10;
    const start = (currentPage - 1) * elements;
    const end = start + elements;
    console.log(newData, 'aqui')
    setCurrencies(newData.slice(start, end));
    setPages(Math.ceil(newData.length / elements))

  }, [last, filters]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  console.log(currencies, 'aqui')

  return (


    <Container maxWidth="sm" sx={{ margin: '10px auto' }}>

      <Typography variant="h4" component="h1" align='center'>
        Divisas
      </Typography>

      <TableContainer component={Paper}>
        <Table size="medium" >
          <TableHead >
            <TableRow sx={{ '& th': { backgroundColor: 'black', color: 'white' } }}>
              <TableCell >Name</TableCell>
              <TableCell >Ask</TableCell>
              <TableCell>Bid</TableCell>

            </TableRow>
            <TableRow>
              <TableCell >
                <TextField
                  placeholder='Name'
                  name='name'
                  value={filters.name}
                  onChange={handleFilterChange}
                  variant="standard"
                /></TableCell>
              <TableCell >
                <TextField
                  name='ask'
                  value={filters.ask}
                  placeholder='Ask'
                  onChange={handleFilterChange}
                  variant="standard"
                />
              </TableCell>
              <TableCell>
                <TextField
                  name='bid'
                  placeholder='Bid'
                  value={filters.bid}
                  onChange={handleFilterChange}
                  variant="standard"
                /></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {currencies.map((row, index) => (
              <TableRow
                key={index}
                sx={{ '& td': { padding: '12px' } }}
              >
                <TableCell >
                  <Typography variant="body1" component="span">
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell >
                  <Typography style={{color:row.statusAsk}} variant="body1" component="span">
                    {row.ask}
                  </Typography>
                </TableCell>
                <TableCell >
                  <Typography  style={{color:row.statusBid}} variant="body1" component="span">
                    {row.bid}
                  </Typography>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TableContainer>

      <Stack alignItems={'center'} sx={{ m: 1 }}>
        <Pagination count={pages} onChange={handlePageChange} />
      </Stack>
    </Container>

  );
}

export default App;
