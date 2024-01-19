'use client';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import React, { useState } from 'react';
import { ProductMutation } from '../../type';
import axiosApi from '@/axiosApi';
import { Button } from '@mui/material';

export default function Home() {
  const [text, setText] = useState({
    encode: '',
    decode: '',
    password: '',
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogError, setDialogError] = useState(false);

  const mutation = useMutation({
    mutationFn: async (productData: ProductMutation) => {
      const encodeResponse = await axiosApi.post('/encode', productData);
      const decodeResponse = await axiosApi.post('/decode', productData);

      return {
        encodeData: encodeResponse.data,
        decodeData: decodeResponse.data,
      };
    },
    onSuccess: (data) => {
      setText({
        encode: data.decodeData,
        decode: data.encodeData,
        password: text.password,
      });
    },
    onError: (error) => {
      console.error('API error:', error);
    },
  });

  const onSubmit = async () => {
    mutation.mutate(text);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if ((text.encode && name === 'decode') || (text.decode && name === 'encode')) {
      setDialogError(true);
      return;
    }

    setText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.encode && text.password) || (text.decode && text.password)) {
      try {
        await onSubmit();
      } catch (error) {
        setOpenDialog(true);
      }
    } else {
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogError(false);
  };


  return (
    <>
      <form onSubmit={submitFormHandler}>
        <Grid
          display="grid"
          justifyContent="center"
          container
          direction="column"
          textAlign="center"
          alignItems="center"
          spacing={2}
          marginTop="200px"
        >
          <TextField
            label="Encode"
            value={text.encode}
            name="encode"
            id="encode"
            type="text"
            onChange={inputChangeHandler}
            sx={{
              width: '500px',
              borderRadius: '7px',
            }}
          />

          <Grid sx={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <TextField
              label="Password"
              value={text.password}
              name="password"
              id="password"
              type="text"
              onChange={inputChangeHandler}
              variant="outlined"
              required
              sx={{
                margin: '20px 5px',
              }}
            />
            <IconButton
              sx={{width: '40px', height: '40px'}}
              type='submit'
            >
              <ArrowUpwardIcon/>
            </IconButton>
            <IconButton
              sx={{width: '40px', height: '40px'}}
              type='submit'
            >
              <ArrowDownwardIcon/>
            </IconButton>
          </Grid>

          <TextField
            label="Decode"
            name="decode"
            id="decode"
            type="text"
            onChange={inputChangeHandler}
            value={text.decode}
            sx={{
              borderRadius: '7px',
              width: '500px',
              height: '200px'
            }}
          />
        </Grid>
      </form>

      <div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Внимание!</DialogTitle>
        <DialogContent>
          <p>Пожалуйста, заполните как минимум два поля.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Закрыть</Button>
        </DialogActions>
      </Dialog>
        <Dialog open={dialogError} onClose={handleCloseDialog}>
          <DialogTitle>Внимание!</DialogTitle>
          <DialogContent>
            <p>Нельзя заполнить три поля одновременно</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Закрыть</Button>
          </DialogActions>
        </Dialog>
    </div>
    </>
  );
}

