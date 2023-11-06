const products = [
  { name : 'p1', price : 100.00 },
  { name : 'p2', price : 200.00 }
];

function App() {

  return (
    <>
      <div className="app">
        <h1>Re-Store</h1>
        <ul>
          {products.map(p => (
            <li key={p.name}>{p.name} - {p.price}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
