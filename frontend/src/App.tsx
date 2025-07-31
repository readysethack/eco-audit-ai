import { useState, useEffect } from 'react'
import './App.css'
import { Button } from "@/components/ui/button"
import axios, { type AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000', //TODO: Adjust this to actual backend URL
});

function getList() {
  api.get("http://localhost:5000/audit/list")
  .then(function (response: AxiosResponse){
    console.log(response.data)
  })
}

function App() {
  const onClick = () => {
    getList()
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={onClick}>Click me</Button>
    </div>
  )
}
export default App


