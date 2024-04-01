// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
// import './App.css'

function App() {
  // const [count, setCount] = useState("")

  // function onClick() {
  //   console.log(import.meta.env.VITE_API_URL);
  //   fetch(import.meta.env.VITE_API_URL, {
  //     method: "POST",
  //   })
  //     .then((response) => response.text())
  //     .then(setCount);
  // }

  return (
    // <>
    //   <div>
    //     <a href="https://vitejs.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={onClick}>
    //       count is {count ? count : "unknown"}
    //     </button>
    //     <div className='read-the-docs'>
    //       <p>Suhaib Was Here</p>
    //       <h1>Husain Basem</h1>
    //       <h1>Mahdi Alebrahim</h1>
    //       <h2>SayedQassim</h2>
    //       <h3>AMIRA</h3>
    //     </div>
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
    
    <div className="App">
      <Navbar />
      <div className="content">
        <h1>Welcome to SolarMap</h1>
        <p>This is a solar map app</p>
        <Home />
      </div>
    </div>
  )
}

export default App
