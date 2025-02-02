import { Welcome,Footer,Navbar,Services,Payments } from './components';

const App=()=>{
  return (
    <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Payments />  
    <Footer />
  </div>
  )
}

export default App
