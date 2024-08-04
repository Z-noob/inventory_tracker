'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from "@/firebase"; //'@/firebase'
import { Box, Typography, Stack, Modal, TextField, Button } from '@mui/material';
import { 
  collection,
  deleteDoc,
  doc,
  getDocs, 
  query,
  getDoc,
  setDoc } from 'firebase/firestore'

export default function Home() {
  const [ inventory, setInventory ] = useState([])
  const [ open, setOpen ] = useState(false)
  const [ itemName, setItemName ] = useState('')
  const [ searchItem, setSearchItem] = useState('');
  const [result, setResult] = useState(null);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleSearch = () => {
    const trimmedSearchItem = searchItem.trim();
    if (trimmedSearchItem) {
      // Find a single matching item
      const foundItem = inventory.find(item =>
        item.name.toLowerCase().includes(trimmedSearchItem.toLowerCase())
      );
      setResult(foundItem || null); // Update result state with the found item or null
      setSearchItem(''); // Clear the input field
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Trigger the search function when Enter is pressed
    }
  };

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={2}
      bgcolor="#e6e6fa"
    >
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          width={{ xs: '90%', sm: 400 }} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          display="flex"
          flexDirection="column" 
          gap={3}
          sx={{ transform: 'translate(-50%, -50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField 
              variant="outlined" 
              fullWidth 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Add New Item
      </Button>
      <Stack 
        width="100%" 
        maxWidth="800px" 
        direction="row" 
        spacing={2} 
        display="flex" 
        justifyContent="center"
        mb={2}
      >
        <TextField 
          variant="outlined" 
          fullWidth 
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter Item to search"
        />
        <Button
          variant="outlined"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Stack>
      <Stack 
        width="100%" 
        maxWidth="800px" 
        spacing={2} 
        p={2}
      >
        {result ? (
          <Box 
            width="100%" 
            minHeight={{ xs: 'auto', sm: '85%' }} 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }} 
            alignItems="center" 
            justifyContent="space-between" 
            bgcolor="#d0f0c0" 
            p={2}
          >
            <Typography variant="h6" color="#333">
              {result.name.charAt(0).toUpperCase() + result.name.slice(1)}
            </Typography>
            <Typography variant="h6" color="#333">
              {result.quantity}
            </Typography>
            <Stack direction="row" spacing={2} mt={{ xs: 2, sm: 0 }}>
              <Button variant="contained" onClick={() => addItem(result.name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => removeItem(result.name)}>
                Remove
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography variant="h6" color="#999" textAlign="center">
            No result found
          </Typography>
        )}
      </Stack>
      <Box 
        border="1px solid #333"  
        p={2} 
        maxWidth="800px" 
        width="100%" 
        overflow="auto"
        boxSizing="border-box"
      >
        <Box 
          width="100%" 
          bgcolor="#ADD8E6" 
          display="flex" 
          alignItems="center" 
          justifyContent="center" 
          p={2} 
          mb={2}
        >
          <Typography variant="h2" color="#333" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack 
          width="100%" 
          spacing={2} 
          p={2}
        >
          {inventory.map(({ name, quantity }) => (
            <Box 
              key={name} 
              width="100%" 
              minHeight="150px" 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              alignItems="center" 
              justifyContent="space-between" 
              bgcolor="#f0f0f0" 
              p={2} 
              borderRadius={1} 
              boxShadow={1}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} mt={{ xs: 2, sm: 0 }}>
                <Button variant="contained" onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}